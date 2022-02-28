import json
from time import sleep
from utils.utils import JSONDataFrameConverter
from google.cloud import bigquery
from configs.constants import Constants
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.redis.redis_hook import RedisHook
from hooks.aws.kinesis_hook import KinesisHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.aws.s3_hook import S3Hook
from logger.log import Logger
from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from configs.system_configs import SystemConfig
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator


class BigQueryOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.operator_data_counter = 0
        self.target_system_config = SystemConfig.get_config(is_source=False)

    def retrieve_data(self):
        bigquery_client = bigquery.Client()

        data_to_be_write = self.operator_data_counter = \
            self.operations.operation(self.configs.operator_source, "retrieve_table")(
                bigquery_client, self.configs.google_bigquery_query, self.configs.google_bigquery_project_id,
                self.configs.google_bigquery_dataset_id, self.configs.google_bigquery_table_id)

        self.operator_data_counter = len(data_to_be_write)

        return data_to_be_write

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=self.retrieve_data()))

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("AWS S3 Write finished.")

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)

        for kafka_data in self.retrieve_data():
            self.operations.operation(self.configs.operator_target, "produce_records")(
                producer=kafka_producer,
                topic_name=self.configs.kafka_topic,
                data=json.dumps(kafka_data))

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Kafka Write finished.")

    def to_elasticsearch(self):
        elasticsearch = ElasticsearchHook.get_elasticsearch(hosts=self.target_system_config[Constants.hosts],
                                                            index=self.configs.elasticsearch_index)
        helper_operator = HelperOperator()

        index = self.configs.elasticsearch_index
        bulk_data = []

        for es_data in self.retrieve_data():
            bulk_data.append(es_data)

            if len(bulk_data) == self.configs.elasticsearch_bulk_limit:
                self.operations.operation(self.configs.operator_target, "index")(elasticsearch, bulk_data, index,
                                                                                 self.configs.elasticsearch_timeout)

        helper_operator.index_remain_elasticsearch_data(elasticsearch, bulk_data, index)

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Elasticsearch Write finished.")

    def to_pubsub(self):
        helper_operator = HelperOperator()
        publisher_client, topic_path = helper_operator.initiate_pubsub()

        for pubsub_data in self.retrieve_data():
            future = publisher_client.publish(topic=topic_path, data=json.dumps(pubsub_data).encode("utf-8"))
            future.add_done_callback(helper_operator.pubsub_publish_callback)

        sleep(self.configs.google_pubsub_timeout / 2)

        Logger.logger.info("Helper Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google PubSub Write finished.")

    def to_kinesis(self):
        kinesis = KinesisHook(
            stream_name=self.configs.aws_kinesis_stream_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        for data in self.retrieve_data():
            self.operator_data_counter += 1
            kinesis.send_message(data)

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Kinesis write operation finished.")

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        data_counter = 0
        for data in self.retrieve_data():
            mongodb.insert(data)
            data_counter += 1

        Logger.logger.info("Operator Process " + str(data_counter) + " data.")
        Logger.logger.info("MongoDB write operation finished.")

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        doc_id = 0
        for data in self.retrieve_data():
            redis.insert_one("doc_" + str(doc_id), data)
            doc_id += 1

        Logger.logger.info("Operator processed " + str(doc_id) + " data.")
        Logger.logger.info("Redis Write finished.")

    def to_sql(self):
        sql = SQLHook(
            dialect=self.configs.operator_target,
            host=self.target_system_config["hostList"][0]["host"],
            database=self.configs.sql_database,
            username=self.target_system_config["username"],
            password=self.target_system_config["password"],
            table_name=self.configs.sql_table_name
        )

        data_counter = 0
        for data in self.retrieve_data():
            sql.insert(data)
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("SQL Write finished.")

    def to_snowflake(self):
        snowflake = SnowflakeHook(
            snowflake_username=self.target_system_config["username"],
            snowflake_password=self.target_system_config["password"],
            snowflake_account=self.target_system_config[Constants.config_property][Constants.account_identifier],
            database=self.configs.snowflake_database,
            snowflake_schema=self.configs.snowflake_schema,
            snowflake_warehouse=self.target_system_config[Constants.config_property][Constants.warehouse],
        )
        data = list()
        for hit in self.retrieve_data():
            data.append(hit)

        JSONDataFrameConverter.to_dataframe(data)

        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")
