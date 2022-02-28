// "config" parameter is not handled here as its not platform specific

const bigquery = {
	project_id: "GOOGLE_BIGQUERY_PROJECT_ID",
	dataset_id: "GOOGLE_BIGQUERY_DATASET_ID",
	table_id: "GOOGLE_BIGQUERY_TABLE_ID",
	query: "GOOGLE_BIGQUERY_QUERY",
};
const dynamodb = {
	table_name: "AWS_DYNAMODB_TABLE_NAME",
	batch_size: "AWS_DYNAMODB_BATCH_SIZE",
};
const elasticsearch = {
	index_name: "ELASTICSEARCH_INDEX",
	query: "ELASTICSEARCH_QUERY"
};
const emr = {
	script_uri: "AWS_EMR_STEP_SCRIPT_URI",
	input_uri: "AWS_EMR_STEP_INPUT_URI",
	master_instance_type: "AWS_EMR_MASTER_INSTANCE_TYPE",
	slave_instance_type: "AWS_EMR_SLAVE_INSTANCE_TYPE",
	instance_count: "AWS_EMR_INSTANCE_COUNT",
};
const kafka = {
	topic_name: "KAFKA_TOPIC"
};
const kinesis = {
	stream_name: "AWS_KINESIS_STREAM_NAME",
};
const lambda = {
	function_name: "AWS_LAMBDA_FUNC_NAME",
	runtime: "AWS_LAMBDA_RUNTIME",
	role: "AWS_LAMBDA_ROLE",
	handler: "AWS_LAMBDA_HANDLER",
	code_s3_bucket: "AWS_LAMBDA_CODE_S3_BUCKET",
	code_s3_key: "AWS_LAMBDA_CODE_S3_KEY",
	payload: "AWS_LAMBDA_PAYLOAD",
};
const mongodb = {
	database_name: "MONGODB_DATABASE_NAME",
	collection_name: "MONGODB_COLLECTION_NAME",
	query: "MONGODB_QUERY"
};
const pubsub = {
	project_id: "GOOGLE_PUBSUB_PROJECT_ID",
	topic: "GOOGLE_PUBSUB_TOPIC",
	topic_action: "GOOGLE_PUBSUB_TOPIC_ACTION",
};
const redis = {
	database: "REDIS_DATABASE"
};
const s3 = {
	bucket_name: "AWS_S3_BUCKET_NAME",
	file_path: "AWS_S3_FILE_PATH",
	file_type: "AWS_S3_FILE_TYPE",
};
const sql = {
	databasename: "SQL_DATABASE",
	query: "SQL_TEXT",
	tablename: "SQL_TABLENAME",
};
const snowflake = {
	database: "SNOWFLAKE_DATABASE",
	schema: "SNOWFLAKE_SCHEMA",
	table_name: "SNOWFLAKE_TABLE_NAME",
	query: "SNOWFLAKE_STATEMENT"
}
const [mariadb, mssql, mysql, oracle, postgresql] = [...Array(5)].map(
	() => sql
);

export {
	bigquery,
	dynamodb,
	elasticsearch,
	emr,
	kafka,
	kinesis,
	lambda,
	mongodb,
	pubsub,
	redis,
	s3,
	mariadb,
	mssql,
	mysql,
	oracle,
	postgresql,
	snowflake
};
