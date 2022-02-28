from operators.base_operator import BaseOperator
from hooks.redis.redis_hook import RedisHook
from hooks.mongodb.mongodb_hook import MongoDBHook
from hooks.elk.elasticsearch_hook import ElasticsearchHook
from hooks.aws.dynamodb_hook import DynamoDBHook
from hooks.relational_db.sql_hook import SQLHook
from hooks.aws.s3_hook import S3Hook
from configs.system_configs import SystemConfig
from configs.configs import Constants
from logger.log import Logger


class PreviewOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        self.source_system_config = SystemConfig.get_config(is_source=True)

        if self.configs.operator_source == Constants.dynamodb:
            table_name = self.configs.aws_dynamo_db_table_name if self.configs.aws_dynamo_db_table_name is not None else ""
            dynamo_db = DynamoDBHook(table_name, self.source_system_config[Constants.config_property])
            self.data = dynamo_db.get_all()
        if self.configs.operator_source == Constants.s3:
            s3 = S3Hook(
                aws_property=self.source_system_config[Constants.config_property]
            )
            self.data = s3.read(
                self.configs.aws_s3_bucket_name,
                self.configs.aws_s3_file_path,
                self.configs.aws_s3_file_type.lower())

        if self.configs.operator_source == Constants.elasticsearch:
            elasticsearch = ElasticsearchHook.get_elasticsearch(
                hosts=list(map((lambda x: x["host"]), self.source_system_config["hostList"])),
                index=self.configs.elasticsearch_index
            )
            self.data = ElasticsearchHook.query(elasticsearch,
                                                index=self.configs.elasticsearch_index,
                                                query=self.configs.elasticsearch_query,
                                                search_limit=self.configs.elasticsearch_search_limit,
                                                scroll=self.configs.elasticsearch_scroll)
        if self.configs.operator_source == Constants.redis:
            redis = RedisHook(
                host=self.source_system_config["hostList"][0]["host"],
                db=self.configs.redis_database,
                password=self.source_system_config["password"]
            )
            self.data = redis.get_all_docs()
        if self.configs.operator_source == Constants.mongodb:
            mongodb = MongoDBHook(
                host=self.source_system_config["hostList"][0]["host"],
                db_name=self.configs.mongodb_database_name,
                collection_name=self.configs.mongodb_collection_name
            )
            self.data = mongodb.get(self.configs.mongodb_query)
        if self.configs.operator_source in Constants.sql_operators:
            sql = SQLHook(
                dialect=self.configs.operator_source,
                host=self.source_system_config["hostList"][0]["host"],
                database=self.configs.sql_database,
                username=self.source_system_config["username"],
                password=self.source_system_config["password"],
                table_name=self.configs.sql_table_name
            )
            self.data = sql.execute(self.configs.sql_text)

    def to_stdout(self):
        if self.data is not None:
            for data in self.data:
                Logger.logger.info(data)
