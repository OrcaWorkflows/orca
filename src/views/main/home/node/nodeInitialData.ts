const BigQuery = {
	project_id: "akis-295110",
	dataset_id: "",
	table_id: "",
	query: "",
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
const PubSub = {
	project_id: "akis-295110",
	topic: "",
	topic_action: "",
};
const S3 = {
	bucket_name: "",
	file_path: "",
	file_type: "",
};

export { S3, EMR, Kafka, ElasticSearch, PubSub, BigQuery };
