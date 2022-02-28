from operators.base_operator import BaseOperator
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.redis.redis_hook import RedisHook
from hooks.aws.kinesis_hook import KinesisHook
from operators.operator_helper import HelperOperator
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.apache.kafka_hook import KafkaHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.aws.s3_hook import S3Hook
from logger.log import Logger
from utils.utils import DecimalEncoder
from configs.constants import Constants
from configs.system_configs import SystemConfig
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
import json


class DynamoDBOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.target_system_config = SystemConfig.get_config(is_source=False)
        self.source_system_config = SystemConfig.get_config(is_source=True)
        if self.configs.operator_source == Constants.dynamodb:
            table_name = self.configs.aws_dynamo_db_table_name if self.configs.aws_dynamo_db_table_name is not None else ""
            self.dynamo_db = DynamoDBHook(table_name, self.source_system_config[Constants.config_property])

    def to_kafka(self):
        kafka_producer = KafkaHook.get_producer(bootstrap_servers=self.target_system_config[Constants.hosts],
                                                topic=self.configs.kafka_topic)
        done = False
        start_key = None

        scan_kwargs = dict()
        data_counter = 0

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                data_counter += 1
                self.operations.operation(self.configs.operator_target, "produce_records")(
                    producer=kafka_producer,
                    topic_name=self.configs.kafka_topic,
                    data=json.dumps(item, cls=DecimalEncoder))

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("From DynamoDB to Kafka write operation finished. Number of processed data: " +
                           str(data_counter))

    def to_pubsub(self):
        helper_operator = HelperOperator()

        publisher_client, topic_path = helper_operator.initiate_pubsub()

        done = False
        start_key = None

        scan_kwargs = dict()
        data_counter = 0

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                data_counter += 1
                future = publisher_client.publish(topic=topic_path,
                                                  data=json.dumps(item).encode("utf-8"))
                future.add_done_callback(helper_operator.pubsub_publish_callback)

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("From DynamoDB to Google PubSub write operation finished. Number of processed data: " +
                           str(data_counter))

    def to_s3(self):
        data_to_be_written = self.dynamo_db.get_all()

        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=data_to_be_written))

        Logger.logger.info("Number of data indexed into S3 from DynamoDB, " + str(len(data_to_be_written)))
        Logger.logger.info("S3 Write finished.")

    def to_elasticsearch(self):
        helper_operator = HelperOperator()
        elasticsearch = ElasticsearchHook.get_elasticsearch(self.target_system_config[Constants.hosts],
                                                            self.configs.elasticsearch_index)
        index = self.configs.elasticsearch_index

        done = False
        start_key = None

        scan_kwargs = dict()
        data_to_be_written = list()

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                data_to_be_written.append(item)
                if len(data_to_be_written) == self.configs.elasticsearch_bulk_limit:
                    self.operations.operation(self.configs.operator_target, "index")(elasticsearch, data_to_be_written,
                                                                                     index,
                                                                                     self.configs.elasticsearch_timeout)
            helper_operator.index_remain_elasticsearch_data(elasticsearch, data_to_be_written, index)

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("Elasticsearch write operation finished.")

    def to_kinesis(self):
        kinesis = KinesisHook(
            stream_name=self.configs.aws_kinesis_stream_name,
            aws_property=self.target_system_config[Constants.config_property]
        )

        done = False
        start_key = None

        scan_kwargs = dict()
        data_counter = 0

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                data_counter += 1
                kinesis.send_message(json.loads(item))

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("From DynamoDB to Kinesis write operation finished. Number of processed data: " +
                           str(data_counter))

    def to_mongo(self):
        mongodb = MongoDBHook(
            host=self.target_system_config["hostList"][0]["host"],
            db_name=self.configs.mongodb_database_name,
            collection_name=self.configs.mongodb_collection_name
        )

        done = False
        start_key = None

        scan_kwargs = dict()
        data_counter = 0

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                data_counter += 1
                mongodb.insert(json.loads(item))

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("From DynamoDB to MongoDB write operation finished. Number of processed data: " +
                           str(data_counter))

    def to_redis(self):
        redis = RedisHook(
            host=self.target_system_config["hostList"][0]["host"],
            db=self.configs.redis_database,
            password=self.target_system_config["password"]
        )

        done = False
        start_key = None

        scan_kwargs = dict()
        doc_id = 0

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                redis.insert_one("doc_" + str(doc_id), json.loads(item))
                doc_id += 1

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("From DynamoDB to Redis write operation finished. Number of processed data: " +
                           str(doc_id))

    def to_sql(self):
        sql = SQLHook(
            dialect=self.configs.operator_target,
            host=self.target_system_config["hostList"][0]["host"],
            database=self.configs.sql_database,
            username=self.target_system_config["username"],
            password=self.target_system_config["password"],
            table_name=self.configs.sql_table_name
        )

        done = False
        start_key = None

        scan_kwargs = dict()
        data_counter = 0

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                sql.insert(json.loads(item))
                data_counter += 1

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        Logger.logger.info("Operator processed " + str(data_counter) + " data.")
        Logger.logger.info("SQL Write finished.")
