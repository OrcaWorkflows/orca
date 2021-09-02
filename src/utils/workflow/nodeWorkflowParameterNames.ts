const BigQuery = {
	project_id: "GOOGLE_BIGQUERY_PROJECT_ID",
	dataset_id: "GOOGLE_BIGQUERY_DATASET_ID",
	table_id: "GOOGLE_BIGQUERY_TABLE_ID",
	query: "GOOGLE_BIGQUERY_QUERY",
};
const DynamoDB = {
	table_name: "AWS_DYNAMODB_TABLE_NAME",
	batch_size: "AWS_DYNAMODB_BATCH_SIZE",
};
const ElasticSearch = {
	host: "ELASTICSEARCH_HOST",
	index_name: "ELASTICSEARCH_INDEX",
};
const EMR = {
	script_uri: "AWS_EMR_STEP_SCRIPT_URI",
	input_uri: "AWS_EMR_STEP_INPUT_URI",
	master_instance_type: "AWS_EMR_MASTER_INSTANCE_TYPE",
	slave_instance_type: "AWS_EMR_SLAVE_INSTANCE_TYPE",
	instance_count: "AWS_EMR_INSTANCE_COUNT",
};
const Kafka = {
	broker_host: "BOOTSTRAP_SERVERS",
	topic_name: "KAFKA_TOPIC",
};
const Kinesis = {
	stream_name: "AWS_KINESIS_STREAM_NAME",
};
const MongoDB = {
	host: "MONGODB_HOST",
	port: "MONGODB_PORT",
	database_name: "MONGODB_DATABASE_NAME",
	collection_name: "MONGODB_COLLECTION_NAME",
};
const PubSub = {
	project_id: "GOOGLE_PUBSUB_PROJECT_ID",
	topic: "GOOGLE_PUBSUB_TOPIC",
	topic_action: "GOOGLE_PUBSUB_TOPIC_ACTION",
};
const Redis = {
	host: "REDIS_HOST",
	port: "REDIS_PORT",
	database: "REDIS_DATABASE",
	password: "REDIS_PASSWORD",
};
const S3 = {
	bucket_name: "AWS_S3_BUCKET_NAME",
	file_path: "AWS_S3_FILE_PATH",
	file_type: "AWS_S3_FILE_TYPE",
};

export {
	BigQuery,
	DynamoDB,
	ElasticSearch,
	EMR,
	Kafka,
	Kinesis,
	MongoDB,
	PubSub,
	Redis,
	S3,
};
