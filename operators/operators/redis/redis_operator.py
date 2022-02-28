from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.aws.kinesis_hook import KinesisHook
from hooks.redis.redis_hook import RedisHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.aws.s3_hook import S3Hook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
from logger.log import Logger
from decimal import Decimal
from configs.system_configs import SystemConfig
from configs.constants import Constants
from utils.utils import JSONDataFrameConverter
import pandas
import json
import time


class RedisOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.source_system_config = SystemConfig.get_config(is_source=True)
        self.target_system_config = SystemConfig.get_config(is_source=False)
        if self.configs.operator_source == Constants.redis:
            self.redis = RedisHook(
                host=self.source_system_config["hostList"][0]["host"],
                db=self.configs.redis_database,
                password=self.source_system_config["password"]
            )

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)
        data_counter = 0
        for key in self.redis.get_all_keys():
            data_counter += 1
            self.operations.operation(self.configs.operator_target, "produce_records")(
                producer=kafka_producer,
                topic_name=self.configs.kafka_topic,
                data=json.dumps(self.redis.get_one(key)))

        Logger.logger.info("Operator Process " + str(data_counter) + " data.")
        Logger.logger.info("Kafka write operation finished.")

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=self.redis.get_all_docs()))

        Logger.logger.info("AWS S3 Write finished.")

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        data_counter = 0
        bulk_data = []

        for key in self.redis.get_all_keys():
            doc = self.redis.get_one(key)
            bulk_data.append(json.loads(json.dumps(doc), parse_float=Decimal))
            if len(bulk_data) >= self.configs.aws_dynamo_db_batch_size:
                dynamodb.batch_write(bulk_data)
                bulk_data.clear()
            data_counter += 1

        if len(bulk_data) > 0:
            dynamodb.batch_write(bulk_data)
            data_counter += len(bulk_data)
            bulk_data.clear()

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("DynamoDB write operation finished.")

    def to_kinesis(self):
        kinesis = KinesisHook(
            stream_name=self.configs.aws_kinesis_stream_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        data_counter = 0
        for key in self.redis.get_all_keys():
            doc = self.redis.get_one(key)
            kinesis.send_message(doc)
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("Kinesis write operation finished.")

    def to_bigquery(self):
        helper_operator = HelperOperator()
        bigquery_client, table = helper_operator.initiate_bigquery()

        data = self.redis.get_all_docs()

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(data))

        data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("Bigquery write operation finished.")

    def to_pubsub(self):
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        data_counter = 0
        for key in self.redis.get_all_keys():
            doc = self.redis.get_one(key)
            future = publisher_client.publish(topic=topic_path,
                                              data=json.dumps(doc).encode("utf-8"))
            future.add_done_callback(helper_operator.pubsub_publish_callback)
            data_counter += 1

        time.sleep(self.configs.google_pubsub_timeout / 2)

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("PubSub write operation finished.")

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        data_counter = 0
        for key in self.redis.get_all_keys():
            mongodb.insert(self.redis.get_one(key))
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("MongoDB Write finished.")

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
        for key in self.redis.get_all_keys():
            sql.insert(self.redis.get_one(key))
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
        data = self.redis.get_all_docs()

        JSONDataFrameConverter.to_dataframe(data)

        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")
