from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from hooks.relational_db.sql_hook import SQLHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.aws.kinesis_hook import KinesisHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.redis.redis_hook import RedisHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.aws.s3_hook import S3Hook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
from logger.log import Logger
from decimal import Decimal
from configs.constants import Constants
from configs.system_configs import SystemConfig
from utils.utils import JSONDataFrameConverter
import json
import pandas
import time


class SQLOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.source_system_config = SystemConfig.get_config(is_source=True)
        self.target_system_config = SystemConfig.get_config(is_source=False)
        if self.configs.operator_source in Constants.sql_operators:
            self.sql = SQLHook(
                dialect=self.configs.operator_source,
                host=self.source_system_config["hostList"][0]["host"],
                database=self.configs.sql_database,
                username=self.source_system_config["username"],
                password=self.source_system_config["password"],
                table_name=self.configs.sql_table_name
            )

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=self.sql.execute(self.configs.sql_text)))

        Logger.logger.info("AWS S3 Write finished.")

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)
        docs = self.sql.execute(self.configs.sql_text)
        data_counter = 0

        for doc in docs:
            data_counter += 1
            self.operations.operation(self.configs.operator_target, "produce_records")(
                producer=kafka_producer,
                topic_name=self.configs.kafka_topic,
                data=json.dumps(doc))

        Logger.logger.info("Operator Process " + str(data_counter) + " data.")
        Logger.logger.info("Kafka write operation finished.")

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        data = self.sql.execute(self.configs.sql_text)
        data_counter = 0
        bulk_data = []

        for doc in data:
            data_counter += 1
            bulk_data.append(json.loads(json.dumps(doc), parse_float=Decimal))
            if len(bulk_data) >= self.configs.aws_dynamo_db_batch_size:
                dynamodb.batch_write(bulk_data)
                bulk_data.clear()

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

        data = self.sql.execute(self.configs.sql_text)
        data_counter = 0
        for doc in data:
            kinesis.send_message(json.loads(json.dumps(doc)))
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("Kinesis write operation finished.")

    def to_bigquery(self):
        helper_operator = HelperOperator()
        bigquery_client, table = helper_operator.initiate_bigquery()

        data = self.sql.execute(self.configs.sql_text)

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(data))

        data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("Bigquery write operation finished.")

    def to_pubsub(self):
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        data = self.sql.execute(self.configs.sql_text)
        data_counter = 0
        for doc in data:
            future = publisher_client.publish(topic=topic_path,
                                              data=json.dumps(doc).encode("utf-8"))
            future.add_done_callback(helper_operator.pubsub_publish_callback)
            data_counter += 1

        time.sleep(self.configs.google_pubsub_timeout / 2)

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("PubSub write operation finished.")

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        doc_id = 0
        data = self.sql.execute(self.configs.sql_text)

        for doc in data:
            redis.insert_one("doc_" + str(doc_id), doc)
            doc_id += 1

        Logger.logger.info("Operator processed " + str(doc_id) + " data.")
        Logger.logger.info("Redis Write finished.")

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        data_counter = 0
        for doc in self.sql.execute(self.configs.sql_text):
            mongodb.insert(doc)
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("MongoDB Write finished.")

    def to_snowflake(self):
        snowflake = SnowflakeHook(
            snowflake_username=self.target_system_config["username"],
            snowflake_password=self.target_system_config["password"],
            snowflake_account=self.target_system_config[Constants.config_property][Constants.account_identifier],
            database=self.configs.snowflake_database,
            snowflake_schema=self.configs.snowflake_schema,
            snowflake_warehouse=self.target_system_config[Constants.config_property][Constants.warehouse],
        )
        data = self.sql.execute(self.configs.sql_text)

        JSONDataFrameConverter.to_dataframe(data)

        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")
