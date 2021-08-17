const BigQuery = {
	project_id: "GOOGLE_BIGQUERY_PROJECT_ID",
	dataset_id: "GOOGLE_BIGQUERY_DATASET_ID",
	table_id: "GOOGLE_BIGQUERY_TABLE_ID",
	query: "GOOGLE_BIGQUERY_QUERY",
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
const PubSub = {
	project_id: "GOOGLE_PUBSUB_PROJECT_ID",
	topic: "GOOGLE_PUBSUB_TOPIC",
	topic_action: "GOOGLE_PUBSUB_TOPIC_ACTION",
};
const S3 = {
	bucket_name: "AWS_S3_BUCKET_NAME",
	file_path: "AWS_S3_FILE_PATH",
	file_type: "AWS_S3_FILE_TYPE",
};

export { S3, EMR, Kafka, ElasticSearch, PubSub, BigQuery };
