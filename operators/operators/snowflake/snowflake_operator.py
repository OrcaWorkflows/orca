from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from hooks.snowflake.snowflake_hook import SnowflakeHook
from hooks.aws.s3_hook import S3Hook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.aws.kinesis_hook import KinesisHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.redis.redis_hook import RedisHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from decimal import Decimal
from configs.constants import Constants
from configs.system_configs import SystemConfig
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
from writers.base.data_type import DataType
from logger.log import Logger
import pandas
import time
import json


class SnowflakeOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.source_system_config = SystemConfig.get_config(is_source=True)
        self.target_system_config = SystemConfig.get_config(is_source=False)
        if self.configs.operator_source == Constants.snowflake:
            self.snowflake = SnowflakeHook(
                snowflake_username=self.source_system_config["username"],
                snowflake_password=self.source_system_config["password"],
                snowflake_account=self.source_system_config[Constants.config_property][Constants.account_identifier],
                database=self.configs.snowflake_database,
                snowflake_schema=self.configs.snowflake_schema,
                snowflake_warehouse=self.source_system_config[Constants.config_property][Constants.warehouse],
            )

    def to_s3(self):
        data = self.snowflake.execute(self.configs.snowflake_statement)

        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(
                        data=data,
                        data_type=DataType.TUPLE
                    ))

        Logger.logger.info("AWS S3 Write finished.")

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)
        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))
        data_counter = 0

        for doc in data:
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

        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))
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

        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))
        data_counter = 0
        for doc in data:
            kinesis.send_message(doc)
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("Kinesis write operation finished.")

    def to_bigquery(self):
        helper_operator = HelperOperator()
        bigquery_client, table = helper_operator.initiate_bigquery()

        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(data))

        data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("Bigquery write operation finished.")

    def to_pubsub(self):
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))
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
        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))

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
        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))

        data_counter = 0
        for doc in data:
            mongodb.insert(doc)
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("MongoDB Write finished.")

    def to_elasticsearch(self):
        elasticsearch = ElasticsearchHook.get_elasticsearch(self.target_system_config[Constants.hosts],
                                                            self.configs.elasticsearch_index)
        helper_operator = HelperOperator()

        index = self.configs.elasticsearch_index
        bulk_data = []

        data_counter = 0

        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))

        for doc in data:
            bulk_data.append(doc)

            if len(bulk_data) == self.configs.elasticsearch_bulk_limit:
                self.operations.operation(self.configs.operator_target, "index")(elasticsearch, bulk_data, index,
                                                                                 self.configs.elasticsearch_timeout)
            data_counter += 1

        helper_operator.index_remain_elasticsearch_data(elasticsearch, bulk_data, index)
        data_counter += len(bulk_data)

        Logger.logger.info("Operator Process " + str(data_counter) + " data.")
        Logger.logger.info("Elasticsearch Write finished.")

    def to_sql(self):
        sql = SQLHook(
            dialect=self.configs.operator_target,
            host=self.target_system_config["hostList"][0]["host"],
            database=self.configs.sql_database,
            username=self.target_system_config["username"],
            password=self.target_system_config["password"],
            table_name=self.configs.sql_table_name
        )

        doc_count = 0
        data = json.loads(self.snowflake.execute(self.configs.snowflake_statement).to_json(orient='records'))
        for doc in data:
            sql.insert(doc)
            doc_count += 1
        Logger.logger.info("Operator processed " + str(doc_count) + " data.")
        Logger.logger.info("SQL Write finished.")
