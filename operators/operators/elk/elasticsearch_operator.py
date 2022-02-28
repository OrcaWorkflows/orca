import json
from time import sleep

import pandas
from decimal import Decimal
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.redis.redis_hook import RedisHook
from hooks.aws.kinesis_hook import KinesisHook
from hooks.snowflake.snowflake_hook import SnowflakeHook
from hooks.aws.s3_hook import S3Hook
from logger.log import Logger
from operators.base_operator import BaseOperator
from operators.operator_helper import HelperOperator
from configs.system_configs import SystemConfig
from configs.constants import Constants
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
from utils.utils import JSONDataFrameConverter


class ElasticsearchOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.operator_data_counter = 0
        self.target_system_config = SystemConfig.get_config(is_source=False)
        if self.configs.operator_source == Constants.elasticsearch:
            self.elasticsearch = ElasticsearchHook.get_elasticsearch(
                hosts=list(map((lambda x: x["host"]), SystemConfig.get_config(is_source=True)["hostList"])),
                index=self.configs.elasticsearch_index
            )

    def accumulate_data(self, elasticsearch):
        data_to_be_written = []
        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for s3_data in search_result['hits']['hits']:
                self.operator_data_counter += 1
                data_to_be_written.append(json.loads(json.dumps(s3_data["_source"])))
            search_result = elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])
        return data_to_be_written

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)
        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for kafka_data in search_result['hits']['hits']:
                self.operations.operation(self.configs.operator_target, "produce_records")(
                    producer=kafka_producer,
                    topic_name=self.configs.kafka_topic,
                    data=json.dumps(kafka_data["_source"]))
                self.operator_data_counter += 1
            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Elasticsearch Read finished.")

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        data_to_be_written = self.accumulate_data(self.elasticsearch)

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=data_to_be_written))

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("AWS S3 Write finished.")

    def to_pubsub(self):
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        index = self.configs.elasticsearch_index
        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for pubsub_data in search_result['hits']['hits']:
                self.operator_data_counter += 1
                future = publisher_client.publish(topic=topic_path,
                                                  data=json.dumps(pubsub_data).encode("utf-8"))
                future.add_done_callback(helper_operator.pubsub_publish_callback)
            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

        sleep(self.configs.google_pubsub_timeout / 2)

        Logger.logger.info("Helper Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google PubSub Write finished.")

    def to_bigquery(self):
        helper_operator = HelperOperator()

        bigquery_client, table = helper_operator.initiate_bigquery()

        bigquery_data = self.operations.operation(self.configs.operator_target, "clean_fields")(
            pandas.DataFrame.from_records(self.accumulate_data(self.elasticsearch)))

        self.operator_data_counter = self.operations.operation(self.configs.operator_target, "load_table")(
            bigquery_client, bigquery_data, table)

        Logger.logger.info("Operator Process " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("Google BigQuery Write finished.")

    def to_dynamodb(self):
        dynamodb = DynamoDBHook(
            table_name=self.configs.aws_dynamo_db_table_name,
            aws_property=self.target_system_config[Constants.config_property]
        )
        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for data in search_result['hits']['hits']:
                self.operator_data_counter += 1
                dynamodb.table.put_item(Item=json.loads(json.dumps(data["_source"]), parse_float=Decimal))

            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

        Logger.logger.info("Number of data processed: " + str(self.operator_data_counter))
        Logger.logger.info("DynamoDB write operation finished.")

    def to_kinesis(self):
        kinesis = KinesisHook(
            stream_name=self.configs.aws_kinesis_stream_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for data in search_result['hits']['hits']:
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

        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for data in search_result['hits']['hits']:
                mongodb.insert(data["_source"])
                self.operator_data_counter += 1
            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

        Logger.logger.info("Operator processed " + str(self.operator_data_counter) + " data.")
        Logger.logger.info("MongoDB Write finished.")

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        doc_id = 0
        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for data in search_result['hits']['hits']:
                redis.insert_one("doc_" + str(doc_id), data.value)
                doc_id += 1
            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

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

        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for data in search_result['hits']['hits']:
                sql.insert(data)
                self.operator_data_counter += 1
            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

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
        search_result, scroll_size, scroll_id = self.operations.operation(self.configs.operator_source, "search")(
            self.elasticsearch,
            self.configs.elasticsearch_index,
            self.configs.elasticsearch_query,
            self.configs.elasticsearch_search_limit,
            self.configs.elasticsearch_scroll)
        while scroll_size > 0:
            for hit in search_result['hits']['hits']:
                data.append(hit)
                self.operator_data_counter += 1
            search_result = self.elasticsearch.scroll(scroll_id=scroll_id, scroll=self.configs.elasticsearch_scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])

        JSONDataFrameConverter.to_dataframe(data)

        snowflake.write(
            data=data,
            table_name=self.configs.snowflake_table_name
        )

        Logger.logger.info("Snowflake write finished.")
