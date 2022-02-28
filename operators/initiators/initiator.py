from operators.aws.kinesis_operator import KinesisOperator
from operators.aws.s3_operator import S3Operator
from operators.preview.preview_operator import PreviewOperator
from operators.aws.emr_operator import EMROperator
from operators.aws.lambda_operator import LambdaOperator
from operators.aws.dynamodb_operator import DynamoDBOperator
from operators.elk.elasticsearch_operator import ElasticsearchOperator
from operators.google.bigquery_operator import BigQueryOperator
from operators.google.pubsub_operator import PubSubOperator
from operators.kafka.kafka_operator import KafkaOperator
from operators.mongodb.mongodb_operator import MongoDBOperator
from operators.redis.redis_operator import RedisOperator
from operators.relational_db.sql_operator import SQLOperator
from operators.snowflake.snowflake_operator import SnowflakeOperator
from configs.configs import ConfigReader
from configs.constants import Constants


def operator_type_switcher(operator_type):
    switcher = {
        Constants.preview: PreviewOperator(),
        Constants.s3: S3Operator(),
        Constants.emr: EMROperator(),
        Constants.dynamodb: DynamoDBOperator(),
        Constants.kafka: KafkaOperator(),
        Constants.kinesis: KinesisOperator(),
        Constants.awslambda: LambdaOperator(),
        Constants.elasticsearch: ElasticsearchOperator(),
        Constants.pubsub: PubSubOperator(),
        Constants.bigquery: BigQueryOperator(),
        Constants.mongodb: MongoDBOperator(),
        Constants.redis: RedisOperator(),
        Constants.postgresql: SQLOperator(),
        Constants.mysql: SQLOperator(),
        Constants.mariadb: SQLOperator(),
        Constants.oracle: SQLOperator(),
        Constants.mssql: SQLOperator(),
        Constants.snowflake: SnowflakeOperator()
    }
    return switcher.get(operator_type, "Invalid operator type")


if __name__ == '__main__':
    config = ConfigReader()
    _operator = operator_type_switcher(config.operator_source)
    target_operator = str(config.operator_target.lower())
    if target_operator == "preview":
        target_operator = "stdout"
    else:
        config.print_configs()
    if target_operator in Constants.sql_operators:
        target_operator = "sql"
    getattr(_operator, str("to_" + target_operator))()
