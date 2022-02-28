import json
from time import sleep
from decimal import Decimal
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.aws.s3_hook import S3Hook
from logger.log import Logger
from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.aws.kinesis_hook import KinesisHook
from hooks.redis.redis_hook import RedisHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from configs.system_configs import SystemConfig
from configs.constants import Constants


class S3Operator(BaseOperator):

    def __init__(self):
        super().__init__()
        self.operator_data_counter = 0
        self.target_system_config = SystemConfig.get_config(is_source=False)
        self.source_system_config = SystemConfig.get_config(is_source=True)
        if self.configs.operator_source == Constants.s3:
            self.s3 = S3Hook(
                aws_property=self.source_system_config[Constants.config_property]
            )

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(self.target_system_config[Constants.hosts], self.configs.kafka_topic)

        for kafka_data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            self.operations.operation(self.configs.operator_target, "produce_records")(
                producer=kafka_producer,
                topic_name=self.configs.kafka_topic,
                data=kafka_data)
            self.operator_data_counter += 1

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Kafka Write finished.")

    def to_elasticsearch(self):
        elasticsearch = ElasticsearchHook.get_elasticsearch(self.target_system_config[Constants.hosts],
                                                            self.configs.elasticsearch_index)
        helper_operator = HelperOperator()

        index = self.configs.elasticsearch_index
        bulk_data = []

        for es_data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            self.operator_data_counter += 1
            bulk_data.append(json.loads(es_data))

            if len(bulk_data) == self.configs.elasticsearch_bulk_limit:
                self.operations.operation(self.configs.operator_target, "index")(elasticsearch, bulk_data, index,
                                                                                 self.configs.elasticsearch_timeout)

        helper_operator.index_remain_elasticsearch_data(elasticsearch, bulk_data, index)

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Elasticsearch Write finished.")

    def to_pubsub(self):
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        for pubsub_data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            self.operator_data_counter += 1
            future = publisher_client.publish(topic=topic_path, data=pubsub_data.encode("utf-8"))
            future.add_done_callback(helper_operator.pubsub_publish_callback)

        sleep(self.configs.google_pubsub_timeout / 2)

        Logger.logger.info("Helper Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google PubSub Write finished.")

    def to_bigquery(self):
        helper_operator = HelperOperator()

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower(),
                "PANDAS"
            ))

        bigquery_client, table = helper_operator.initiate_bigquery()

        self.operator_data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data,
            table)
        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google BigQuery Write finished.")

    def to_emr(self):
        Logger.logger.info("Passing parameters to EMR.")
        s3_property = {
            "AWS_S3_SOURCE_BUCKET_NAME": self.configs.aws_s3_bucket_name,
            "AWS_S3_SOURCE_FILE_PATH": self.configs.aws_s3_file_path,
            "AWS_S3_SOURCE_FILE_TYPE": self.configs.aws_s3_file_type
        }
        SystemConfig.set_property(s3_property, is_source=False)

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        bulk_data = []

        for data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            self.operator_data_counter += 1
            bulk_data.append(json.loads(data, parse_float=Decimal))

            if len(bulk_data) >= self.configs.aws_dynamo_db_batch_size:
                dynamodb.batch_write(bulk_data)
                bulk_data.clear()

        if len(bulk_data) > 0:
            dynamodb.batch_write(bulk_data)
            bulk_data.clear()

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("DynamoDB write operation finished.")

    def to_kinesis(self):
        kinesis = KinesisHook(
            stream_name=self.configs.aws_kinesis_stream_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        for data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            self.operator_data_counter += 1
            kinesis.send_message(json.loads(data))

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Kinesis write operation finished.")

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        for data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            self.operator_data_counter += 1
            mongodb.insert(json.loads(data))

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("MongoDB write operation finished.")

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        doc_id = 0
        for data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            redis.insert_one("doc_" + str(doc_id), json.loads(data))
            doc_id += 1

        Logger.logger.info("Operator Process " + str(doc_id) + " data.")
        Logger.logger.info("Redis write operation finished.")

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
        for data in self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower()):
            sql.insert(json.loads(data))
            data_counter += 1

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("SQL Write finished.")

    def to_lambda(self):
        Logger.logger.info("Passing parameters to Lambda.")
        s3_property = {
            "AWS_S3_SOURCE_BUCKET_NAME": self.configs.aws_s3_bucket_name,
            "AWS_S3_SOURCE_FILE_PATH": self.configs.aws_s3_file_path,
            "AWS_S3_SOURCE_FILE_TYPE": self.configs.aws_s3_file_type
        }
        SystemConfig.set_property(s3_property, is_source=False)

    def to_snowflake(self):
        snowflake = SnowflakeHook(
            snowflake_username=self.target_system_config["username"],
            snowflake_password=self.target_system_config["password"],
            snowflake_account=self.target_system_config[Constants.config_property][Constants.account_identifier],
            database=self.configs.snowflake_database,
            snowflake_schema=self.configs.snowflake_schema,
            snowflake_warehouse=self.target_system_config[Constants.config_property][Constants.warehouse],
        )
        data = self.s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower(),
                read_type=Constants.pandas
        )
        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")
