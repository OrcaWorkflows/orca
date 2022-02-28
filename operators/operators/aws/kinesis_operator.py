from operators.base_operator import BaseOperator
from hooks.aws.kinesis_hook import KinesisHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.redis.redis_hook import RedisHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from hooks.aws.s3_hook import S3Hook
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from operators.operator_helper import HelperOperator
from logger.log import Logger
from decimal import Decimal
from configs.constants import Constants
from configs.system_configs import SystemConfig
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
import json
from utils.utils import JSONDataFrameConverter
import time
import pandas


class KinesisOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.target_system_config = SystemConfig.get_config(is_source=False)
        self.source_system_config = SystemConfig.get_config(is_source=True)
        if self.configs.operator_source == Constants.kinesis:
            self.kinesis = KinesisHook(
                stream_name=self.configs.aws_kinesis_stream_name,
                aws_property=self.source_system_config[Constants.config_property]
            )

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0
        data_to_be_written = list()

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                data_to_be_written.append(json.loads(record["Data"]))
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=data_to_be_written))

        Logger.logger.info("Operator Process " + str(len(data_to_be_written)) + " data.")
        Logger.logger.info("AWS S3 Write finished.")

    def to_elasticsearch(self):
        elasticsearch = ElasticsearchHook.get_elasticsearch(hosts=self.target_system_config[Constants.hosts],
                                                            index=self.configs.elasticsearch_index)
        helper_operator = HelperOperator()

        index = self.configs.elasticsearch_index
        bulk_data = []

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0
        data_counter = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                data_counter += 1
                bulk_data.append(json.loads(record["Data"]))
                if len(bulk_data) == self.configs.elasticsearch_bulk_limit:
                    self.operations.operation(self.configs.operator_target, "index")(elasticsearch, bulk_data, index,
                                                                                     self.configs.elasticsearch_timeout)
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

        if len(bulk_data) > 0:
            data_counter += len(bulk_data)
            helper_operator.index_remain_elasticsearch_data(elasticsearch, bulk_data, index)

        Logger.logger.info("Operator Process " + str(data_counter) + " data.")
        Logger.logger.info("Elasticsearch Write finished.")

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        bulk_data = []

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0
        data_counter = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                data_counter += 1
                bulk_data.append(json.loads(record["Data"], parse_float=Decimal))
                if len(bulk_data) == self.configs.elasticsearch_bulk_limit:
                    dynamodb.batch_write(bulk_data)
                    bulk_data.clear()
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

        if len(bulk_data) > 0:
            data_counter += len(bulk_data)
            dynamodb.batch_write(bulk_data)
            bulk_data.clear()

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("DynamoDB Write finished.")

    def to_bigquery(self):
        helper_operator = HelperOperator()

        bigquery_client, table = helper_operator.initiate_bigquery()

        data_to_be_written = []

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                data_to_be_written.append(json.loads(record["Data"]))
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(data_to_be_written))

        data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)

        Logger.logger.info("Operator Process " + str(data_counter) + " data.")
        Logger.logger.info("Google BigQuery Write finished.")

    def to_mongodb(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0
        data_counter = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                data_counter += 1
                mongodb.insert(json.loads(record["Data"]))
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("MongoDB Write finished.")

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0
        doc_id = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                doc_id += 1
                redis.insert_one("doc_" + str(doc_id), json.loads(record["Data"]))
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

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

        shard_it = self.kinesis.get_shard_iterator()

        empty_counter = 0
        data_counter = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                sql.insert(json.loads(record["Data"]))
                data_counter += 1
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

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
        shard_it = self.kinesis.get_shard_iterator()

        data = list()
        empty_counter = 0
        data_counter = 0

        while True:
            res = self.kinesis.kinesis.get_records(ShardIterator=shard_it)
            if len(res["Records"]) == 0:
                empty_counter += 1
                if empty_counter > 10:
                    break
            for record in res["Records"]:
                data.append(json.loads(record["Data"]))
                data_counter += 1
            shard_it = res["NextShardIterator"]
            time.sleep(0.5)

        data = JSONDataFrameConverter.to_dataframe(data)
        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )
        Logger.logger.info("Snowflake write finished.")
