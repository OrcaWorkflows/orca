const BigQuery = {
	project_id: "akis-295110",
	dataset_id: "",
	table_id: "",
	query: "",
};
const DynamoDB = {
	table_name: "",
	batch_size: 1000,
};
const ElasticSearch = {
	host: "",
	index_name: "",
};
const EMR = {
	script_uri: "",
	input_uri: "",
	master_instance_type: "m5.xlarge",
	slave_instance_type: "m5.xlarge",
	instance_count: 3,
};
const Kafka = {
	topic_name: "",
	broker_host: "",
};
const Kinesis = {
	stream_name: "",
};
const MongoDB = {
	host: "",
	port: "",
	database_name: "",
	collection_name: "",
};
const PubSub = {
	project_id: "akis-295110",
	topic: "",
	topic_action: "",
};
const Redis = {
	host: "",
	port: 27017,
	database: "",
	password: "",
};
const S3 = {
	bucket_name: "",
	file_path: "",
	file_type: "",
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
