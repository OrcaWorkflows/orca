from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.redis.redis_hook import RedisHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.aws.s3_hook import S3Hook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from logger.log import Logger
from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from google.cloud import pubsub_v1
from decimal import Decimal
from configs.system_configs import SystemConfig
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
from configs.constants import Constants
from utils.utils import JSONDataFrameConverter
import json
import pandas


class PubSubOperator(BaseOperator):
    operator_data_counter = 0

    def __init__(self):
        super().__init__()
        self.index = self.configs.elasticsearch_index
        self.timeout = self.configs.elasticsearch_timeout
        self.data_to_be_written = []
        self.target_system_config = SystemConfig.get_config(is_source=False)

    def consume_data(self):
        subscriber_client = pubsub_v1.SubscriberClient()
        publisher_client = pubsub_v1.PublisherClient()

        topic_path = publisher_client.topic_path(
            self.configs.google_pubsub_project_id, self.configs.google_pubsub_topic
        )

        subscription_path = subscriber_client.subscription_path(
            self.configs.google_pubsub_project_id, self.configs.google_pubsub_topic
        )

        with pubsub_v1.SubscriberClient() as subscriber:
            try:
                future = subscriber.subscribe(subscription_path, self.callback)
                future.result(timeout=self.configs.google_pubsub_timeout)
            except Exception as ex:
                subscriber.close()
                future.cancel()
                if self.configs.google_pubsub_topic_action == "delete":
                    self.operations.operation(self.configs.operator_source, "delete_props")(publisher_client,
                                                                                            subscription_path,
                                                                                            topic_path)
                Logger.logger.error(ex)

    def print_operator_log(self):
        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info(str(self.configs.operator_target).capitalize() + " Write finished.")

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)
        self.consume_data()

        for kafka_data in self.data_to_be_written:
            self.operations.operation(self.configs.operator_target, "produce_records")(
                producer=kafka_producer,
                topic_name=self.configs.kafka_topic,
                data=kafka_data)

        self.print_operator_log()

    def to_elasticsearch(self):
        elasticsearch = ElasticsearchHook.get_elasticsearch(hosts=self.target_system_config[Constants.hosts],
                                                            index=self.configs.elasticsearch_index)
        self.consume_data()

        data_will_be_indexed = []
        for elasticsearch_data in self.data_to_be_written:
            data_will_be_indexed.append(elasticsearch_data)
            if len(data_will_be_indexed) == self.bulk_limit:
                self.operations.operation(self.configs.operator_target, "index")(elasticsearch,
                                                                                 data_will_be_indexed,
                                                                                 self.index,
                                                                                 self.timeout)

        if len(data_will_be_indexed) > 0:
            self.operations.operation(self.configs.operator_target, "index")(elasticsearch,
                                                                             data_will_be_indexed,
                                                                             self.index,
                                                                             self.timeout)

        self.print_operator_log()

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )
        self.consume_data()

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=self.data_to_be_written))

        self.print_operator_log()

    def to_bigquery(self):
        helper_operator = HelperOperator()
        bigquery_client, table = helper_operator.initiate_bigquery()

        self.consume_data()

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(self.data_to_be_written))

        self.operator_data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)
        self.print_operator_log()

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        bulk_data = []

        self.consume_data()

        for data in self.data_to_be_written:
            self.operator_data_counter += 1
            bulk_data.append(json.loads(json.dumps(data), parse_float=Decimal))
            if len(bulk_data) >= self.configs.aws_dynamo_db_batch_size:
                dynamodb.batch_write(bulk_data)
                bulk_data.clear()

        if len(bulk_data) > 0:
            dynamodb.batch_write(bulk_data)
            bulk_data.clear()

        self.print_operator_log()

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        self.consume_data()
        for data in self.data_to_be_written:
            self.operator_data_counter += 1
            mongodb.insert(data)

        self.print_operator_log()

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        self.consume_data()
        doc_id = 0
        for data in self.data_to_be_written:
            redis.insert_one("doc_" + str(doc_id), data)
            doc_id += 1

        self.print_operator_log()

    def to_sql(self):
        sql = SQLHook(
            dialect=self.configs.operator_target,
            host=self.target_system_config["hostList"][0]["host"],
            database=self.configs.sql_database,
            username=self.target_system_config["username"],
            password=self.target_system_config["password"],
            table_name=self.configs.sql_table_name
        )

        self.consume_data()

        for data in self.data_to_be_written:
            sql.insert(data)
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
        for hit in self.data_to_be_written:
            data.append(hit)

        JSONDataFrameConverter.to_dataframe(data)

        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")

    def callback(self, message):
        self.operator_data_counter += 1
        self.data_to_be_written.append(json.loads(message.data))
        message.ack()
