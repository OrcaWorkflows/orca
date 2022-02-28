class Constants:
    @staticmethod
    def get_api_check_keys():
        return [
            "None",
            None,
            "",
            " "
        ]

    preview = "preview"

    # Operators
    sql_operators = ["postgresql", "mysql", "mariadb", "oracle", "mssql"]
    aws = "aws"
    s3 = "s3"
    dynamodb = "dynamodb"
    emr = "emr"
    awslambda = "lambda"
    kafka = "kafka"
    kinesis = "kinesis"
    elasticsearch = "elasticsearch"
    pubsub = "pubsub"
    bigquery = "bigquery"
    mongodb = "mongodb"
    redis = "redis"
    postgresql = "postgresql"
    mysql = "mysql"
    mariadb = "mariadb"
    oracle = "oracle"
    mssql = "mssql"
    snowflake = "snowflake"

    # System
    divide = "/"
    config_api = "/api/system-config"

    # Variable
    config_property = "property"
    hosts = "hostList"
    aws_access_key_id = "AWS_ACCESS_KEY_ID"
    aws_access_secret_key = "AWS_ACCESS_SECRET_KEY"
    aws_region_name = "AWS_REGION_NAME"
    account_identifier = "SNOWFLAKE_ACCOUNT_IDENTIFIER"
    warehouse = "SNOWFLAKE_WAREHOUSE"
    pandas = "PANDAS"
    schema = "SCHEMA"
