import json
import os
from .constants import Constants
from logger.log import Logger


class ConfigReader:
    line = "------------------------------------------"

    def __init__(self) -> None:
        super().__init__()
        # Operator
        self.operator_source = os.getenv("OPERATOR_SOURCE")
        self.operator_target = os.getenv("OPERATOR_TARGET")

        self.access_token = os.getenv("ORCA_SYSTEM_ACCESS_TOKEN")

        if self.operator_source is None:
            Logger.logger.error("OPERATOR_SOURCE must be set.")
            exit(1)
        if self.operator_target is None:
            Logger.logger.error("OPERATOR_TARGET must be set.")
            exit(1)

        # Orca Service
        self.orca_service = os.getenv("ORCA_SERVICE")
        self.source_system_config_id = os.getenv("SOURCE_SYSTEM_CONFIG_ID")
        self.target_system_config_id = os.getenv("TARGET_SYSTEM_CONFIG_ID")

        # AWS
        # AWS S3
        self.aws_s3_bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
        self.aws_s3_file_path = os.getenv("AWS_S3_FILE_PATH")
        self.aws_s3_file_type = os.getenv("AWS_S3_FILE_TYPE")

        # AWS EMR
        self.aws_emr_cluster_name = os.getenv("AWS_EMR_CLUSTER_NAME", "Orca Cluster")
        self.aws_emr_applications = os.getenv("AWS_EMR_APPLICATIONS", "Spark")
        self.aws_emr_step_script_uri = os.getenv("AWS_EMR_STEP_SCRIPT_URI")
        self.aws_emr_master_instance_type = os.getenv("AWS_EMR_MASTER_INSTANCE_TYPE", "m5.xlarge")
        self.aws_emr_slave_instance_type = os.getenv("AWS_EMR_SLAVE_INSTANCE_TYPE", "m5.xlarge")
        self.aws_emr_instance_count = os.getenv("AWS_EMR_INSTANCE_COUNT", 3)
        self.aws_emr_keep_alive = os.getenv("AWS_EMR_KEEP_ALIVE", False)

        # AWS DynamoDB
        self.aws_dynamo_db_table_name = os.getenv("AWS_DYNAMODB_TABLE_NAME") \
            if os.getenv("AWS_DYNAMODB_TABLE_NAME") is not None else ""
        self.aws_dynamo_db_batch_size = int(os.getenv("AWS_DYNAMODB_BATCH_SIZE", 1000))

        # AWS Kinesis
        self.aws_kinesis_stream_name = os.getenv("AWS_KINESIS_STREAM_NAME")

        # AWS Lambda
        self.aws_lambda_function_name = os.getenv("AWS_LAMBDA_FUNC_NAME")
        self.aws_lambda_runtime = os.getenv("AWS_LAMBDA_RUNTIME")
        self.aws_lambda_role = os.getenv("AWS_LAMBDA_ROLE")
        self.aws_lambda_handler = os.getenv("AWS_LAMBDA_HANDLER")
        self.aws_lambda_code_bucket = os.getenv("AWS_LAMBDA_CODE_S3_BUCKET")
        self.aws_lambda_code_key = os.getenv("AWS_LAMBDA_CODE_S3_KEY")
        self.aws_lambda_payload = os.getenv("AWS_LAMBDA_PAYLOAD")

        # Kafka
        self.kafka_topic = os.getenv("KAFKA_TOPIC")

        # Elasticsearch
        self.elasticsearch_index = os.getenv("ELASTICSEARCH_INDEX")
        self.elasticsearch_query = json.loads(os.getenv("ELASTICSEARCH_QUERY", '{"query": {"match_all": {}}}'))
        self.elasticsearch_search_limit = int(os.getenv("ELASTICSEARCH_SEARCH_LIMIT", "1000"))
        self.elasticsearch_scroll = os.getenv("ELASTICSEARCH_SCROLL", "30m")
        self.elasticsearch_index_bulk_limit = int(os.getenv("ELASTICSEARCH_INDEX_BULK_LIMIT", "1000"))
        self.elasticsearch_timeout = int(os.getenv("ELASTICSEARCH_TIMEOUT", "200"))

        # Google

        # PubSub
        self.google_pubsub_project_id = os.getenv("GOOGLE_PUBSUB_PROJECT_ID")
        self.google_pubsub_topic = os.getenv("GOOGLE_PUBSUB_TOPIC")
        self.google_pubsub_topic_action = os.getenv("GOOGLE_PUBSUB_TOPIC_ACTION", "delete")
        self.google_pubsub_timeout = int(os.getenv("GOOGLE_PUBSUB_TIMEOUT", "30"))
        self.google_pubsub_batch_size = int(os.getenv("GOOGLE_PUBSUB_BATCH_SIZE", "1000"))
        self.google_pubsub_latency = float(os.getenv("GOOGLE_PUBSUB_MAX_LATENCY", "1"))
        self.google_pubsub_bytes = int(os.getenv("GOOGLE_PUBSUB_MAX_BYTES", "524288"))

        # BigQuery
        self.google_bigquery_project_id = os.getenv("GOOGLE_BIGQUERY_PROJECT_ID")
        self.google_bigquery_dataset_id = os.getenv("GOOGLE_BIGQUERY_DATASET_ID")
        self.google_bigquery_table_id = os.getenv("GOOGLE_BIGQUERY_TABLE_ID")
        self.google_bigquery_query = os.getenv("GOOGLE_BIGQUERY_QUERY")

        # MongoDB
        self.mongodb_database_name = os.getenv("MONGODB_DATABASE_NAME")
        self.mongodb_collection_name = os.getenv("MONGODB_COLLECTION_NAME")
        self.mongodb_query = os.getenv("MONGODB_QUERY")

        # Redis
        self.redis_database = int(os.getenv("REDIS_DATABASE", 0))

        # SQL
        self.sql_database = os.getenv("SQL_DATABASE")
        self.sql_text = os.getenv("SQL_TEXT")
        self.sql_table_name = os.getenv("SQL_TABLENAME")

        # Snowflake
        self.snowflake_statement = os.getenv("SNOWFLAKE_STATEMENT")
        self.snowflake_database = os.getenv("SNOWFLAKE_DATABASE")
        self.snowflake_schema = os.getenv("SNOWFLAKE_SCHEMA")
        self.snowflake_table_name = os.getenv("SNOWFLAKE_TABLE_NAME")

    def print_configs(self):
        Logger.logger.info("Operator Configs")
        Logger.logger.info(self.line)
        Logger.logger.info("OPERATOR_SOURCE: " + str(self.operator_source))
        Logger.logger.info("OPERATOR_TARGET: " + str(self.operator_target))
        Logger.logger.info(self.line)
        if self.operator_source == Constants.s3 or self.operator_target == Constants.s3:
            Logger.logger.info("S3 Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("AWS_S3_BUCKET_NAME: " + str(self.aws_s3_bucket_name))
            Logger.logger.info("AWS_S3_FILE_PATH: " + str(self.aws_s3_file_path))
            Logger.logger.info("AWS_S3_FILE_TYPE: " + str(self.aws_s3_file_type))
            Logger.logger.info(self.line)
        if self.operator_source == Constants.dynamodb or self.operator_target == Constants.dynamodb:
            Logger.logger.info("DynamoDB Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("AWS_DYNAMODB_TABLE_NAME: " + str(self.aws_dynamo_db_table_name))
            Logger.logger.info(self.line)
        if self.operator_source == Constants.kinesis or self.operator_target == Constants.kinesis:
            Logger.logger.info("Kinesis Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("AWS_KINESIS_STREAM_NAME: " + str(self.aws_kinesis_stream_name))
            Logger.logger.info(self.line)
        if self.operator_source == Constants.emr or self.operator_target == Constants.emr:
            Logger.logger.info("EMR Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("AWS_EMR_CLUSTER_NAME: " + str(self.aws_emr_cluster_name))
            Logger.logger.info("AWS_EMR_APPLICATIONS: " + str(self.aws_emr_applications))
            Logger.logger.info("AWS_EMR_STEP_SCRIPT_URI: " + str(self.aws_emr_step_script_uri))
            Logger.logger.info("AWS_EMR_MASTER_INSTANCE_TYPE: " + str(self.aws_emr_master_instance_type))
            Logger.logger.info("AWS_EMR_SLAVE_INSTANCE_TYPE: " + str(self.aws_emr_slave_instance_type))
            Logger.logger.info("AWS_EMR_INSTANCE_COUNT: " + str(self.aws_emr_instance_count))
            Logger.logger.info("AWS_EMR_KEEP_ALIVE: " + str(self.aws_emr_keep_alive))
            Logger.logger.info(self.line)
        if self.operator_source == Constants.awslambda or self.operator_target == Constants.awslambda:
            Logger.logger.info("AWS Lambda Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("AWS_LAMBDA_FUNC_NAME: " + str(self.aws_lambda_function_name))
            Logger.logger.info("AWS_LAMBDA_RUNTIME: " + str(self.aws_lambda_runtime))
            Logger.logger.info("AWS_LAMBDA_ROLE: " + str(self.aws_lambda_role))
            Logger.logger.info("AWS_LAMBDA_HANDLER: " + str(self.aws_lambda_handler))
            Logger.logger.info("AWS_LAMBDA_CODE_S3_BUCKET: " + str(self.aws_lambda_code_bucket))
            Logger.logger.info("AWS_LAMBDA_CODE_S3_KEY: " + str(self.aws_lambda_code_key))
            Logger.logger.info("AWS_LAMBDA_PAYLOAD: " + str(self.aws_lambda_payload))
            Logger.logger.info(self.line)
        if self.operator_source == Constants.kafka or self.operator_target == Constants.kafka:
            Logger.logger.info("Kafka Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("KAFKA_TOPIC: " + str(self.kafka_topic))
            Logger.logger.info(self.line)
        if self.operator_source == Constants.elasticsearch or self.operator_target == Constants.elasticsearch:
            Logger.logger.info("Elasticsearch Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("ELASTICSEARCH_INDEX: " + str(self.elasticsearch_index))
            Logger.logger.info("ELASTICSEARCH_QUERY: " + str(self.elasticsearch_query))
            Logger.logger.info("ELASTICSEARCH_SEARCH_LIMIT: " + str(self.elasticsearch_search_limit))
            Logger.logger.info("ELASTICSEARCH_SCROLL: " + str(self.elasticsearch_scroll))
            Logger.logger.info("ELASTICSEARCH_TIMEOUT: " + str(self.elasticsearch_timeout))
            Logger.logger.info(self.line)
        if self.operator_source in Constants.sql_operators or self.operator_target in Constants.sql_operators:
            Logger.logger.info("SQL Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("SQL_DATABASE: " + str(self.sql_database))
            Logger.logger.info("SQL_TEXT: " + str(self.sql_text))
            Logger.logger.info("SQL_TABLENAME: " + str(self.sql_table_name))
            Logger.logger.info(self.line)
        if self.operator_source in Constants.pubsub or self.operator_target in Constants.pubsub:
            Logger.logger.info("PubSub Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("GOOGLE_PUBSUB_PROJECT_ID: " + str(self.google_pubsub_project_id))
            Logger.logger.info("GOOGLE_PUBSUB_TOPIC: " + str(self.google_pubsub_topic))
            Logger.logger.info("GOOGLE_PUBSUB_TIMEOUT: " + str(self.google_pubsub_timeout))
            Logger.logger.info(self.line)
        if self.operator_source in Constants.bigquery or self.operator_target in Constants.bigquery:
            Logger.logger.info("BigQuery Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("GOOGLE_BIGQUERY_PROJECT_ID: " + str(self.google_bigquery_project_id))
            Logger.logger.info("GOOGLE_BIGQUERY_DATASET_ID: " + str(self.google_bigquery_dataset_id))
            Logger.logger.info("GOOGLE_BIGQUERY_TABLE_ID: " + str(self.google_bigquery_table_id))
            Logger.logger.info("GOOGLE_BIGQUERY_QUERY: " + str(self.google_bigquery_query))
            Logger.logger.info(self.line)
        if self.operator_source in Constants.mongodb or self.operator_target in Constants.mongodb:
            Logger.logger.info("MongoDB Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("MONGODB_DATABASE_NAME: " + str(self.mongodb_database_name))
            Logger.logger.info("MONGODB_COLLECTION_NAME: " + str(self.mongodb_collection_name))
            Logger.logger.info("MONGODB_QUERY: " + str(self.mongodb_query))
            Logger.logger.info(self.line)
        if self.operator_source in Constants.redis or self.operator_target in Constants.redis:
            Logger.logger.info("Redis Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("REDIS_DATABASE: " + str(self.redis_database))
            Logger.logger.info(self.line)
        if self.operator_source in Constants.snowflake or self.operator_target in Constants.snowflake:
            Logger.logger.info("Snowflake Configs")
            Logger.logger.info(self.line)
            Logger.logger.info("SNOWFLAKE_STATEMENT: " + str(self.snowflake_statement))
            Logger.logger.info("SNOWFLAKE_DATABASE: " + str(self.snowflake_database))
            Logger.logger.info("SNOWFLAKE_SCHEMA: " + str(self.snowflake_schema))
            Logger.logger.info("SNOWFLAKE_TABLE_NAME: " + str(self.snowflake_table_name))
            Logger.logger.info(self.line)
