import json
from time import sleep
import pandas
from utils.utils import JSONDataFrameConverter
from decimal import Decimal
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.redis.redis_hook import RedisHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.aws.s3_hook import S3Hook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from logger.log import Logger
from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from configs.system_configs import SystemConfig
from configs.constants import Constants
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator


class KafkaOperator(BaseOperator):

    def __init__(self):
        super().__init__()
        self.operator_data_counter = 0
        self.target_system_config = SystemConfig.get_config(is_source=False)
        self.source_system_config = SystemConfig.get_config(is_source=True)
        if self.configs.operator_source == Constants.kafka:
            bootstrap_servers = [x["host"] for x in self.source_system_config[Constants.hosts]]
            self.consumer = KafkaHook.get_consumer(
                bootstrap_servers,
                self.configs.kafka_topic
            )

    def to_s3(self):
        self.consumer.subscribe(topics=[self.configs.kafka_topic])
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        data_to_be_written = []

        for s3_data in self.consumer:
            self.operator_data_counter += 1
            data_to_be_written.append(json.loads(s3_data.value))

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=data_to_be_written))

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("AWS S3 Write finished.")

    def to_elasticsearch(self):
        self.consumer.subscribe(topics=[self.configs.kafka_topic])
        elasticsearch = ElasticsearchHook.get_elasticsearch(hosts=self.target_system_config[Constants.hosts],
                                                            index=self.configs.elasticsearch_index)
        helper_operator = HelperOperator()

        index = self.configs.elasticsearch_index
        bulk_data = []

        for elasticsearch_data in self.consumer:
            self.operator_data_counter += 1
            bulk_data.append(json.loads(elasticsearch_data.value))

            if len(bulk_data) == self.configs.elasticsearch_bulk_limit:
                self.operations.operation(
                    self.configs.operator_target,
                    "index"
                )(elasticsearch, bulk_data, index,
                  self.configs.elasticsearch_timeout)

        helper_operator.index_remain_elasticsearch_data(elasticsearch, bulk_data, index)

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Elasticsearch Write finished.")

    def to_pubsub(self):
        self.consumer.subscribe(topics=[self.configs.kafka_topic])
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        for pubsub_data in self.consumer:
            self.operator_data_counter += 1
            try:
                data = json.dumps(json.loads(pubsub_data.value)).encode("utf-8")
            except Exception as ex:
                Logger.logger.error(ex)
                Logger.logger.error("Data type error on :" + str(pubsub_data.value))
                Logger.logger.error("Continuing...")
                continue
            future = publisher_client.publish(topic=topic_path,
                                              data=data)
            future.add_done_callback(helper_operator.pubsub_publish_callback)

        sleep(self.configs.google_pubsub_timeout / 2)

        Logger.logger.info("Helper Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google PubSub Write finished.")

    def to_bigquery(self):
        self.consumer.subscribe(topics=[self.configs.kafka_topic])
        helper_operator = HelperOperator()

        bigquery_client, table = helper_operator.initiate_bigquery()

        data_to_be_written = []
        for bigquery_data in self.consumer:
            self.operator_data_counter += 1
            data_to_be_written.append(json.loads(bigquery_data.value))

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(data_to_be_written))

        self.operator_data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google BigQuery Write finished.")

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        self.consumer.subscribe(topics=[self.configs.kafka_topic])

        bulk_data = []

        for data in self.consumer:
            self.operator_data_counter += 1
            bulk_data.append(json.loads(data.value, parse_float=Decimal))
            if len(bulk_data) >= self.configs.aws_dynamo_db_batch_size:
                dynamodb.batch_write(bulk_data)
                bulk_data.clear()

        if len(bulk_data) > 0:
            dynamodb.batch_write(bulk_data)
            bulk_data.clear()

        Logger.logger.info("Operator processed " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("DynamoDB Write finished.")

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        self.consumer.subscribe(topics=[self.configs.kafka_topic])

        for data in self.consumer:
            self.operator_data_counter += 1
            mongodb.insert(json.loads(data.value))

        Logger.logger.info("Operator processed " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("MongoDB Write finished.")

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        self.consumer.subscribe(topics=[self.configs.kafka_topic])
        doc_id = 0

        for data in self.consumer:
            redis.insert_one("doc_" + str(doc_id), json.loads(data.value))
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

        self.consumer.subscribe(topics=[self.configs.kafka_topic])

        for data in self.consumer:
            sql.insert(json.loads(data.value))
            self.operator_data_counter += 1

        Logger.logger.info("Operator processed " + str(self.operator_data_counter) + " data.")
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
        for msg in self.consumer:
            data.append(json.loads(msg.value))

        JSONDataFrameConverter.to_dataframe(data)

        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")
