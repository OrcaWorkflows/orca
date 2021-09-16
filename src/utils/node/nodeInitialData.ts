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
	port: 27017,
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
	port: 6379,
	database: "",
	//password: "",  Might add later on
};
const S3 = {
	bucket_name: "",
	file_path: "",
	file_type: "",
};

const SQLInitialData = {
	host: "",
	port: "",
	username: "",
	password: "",
	databasename: "",
	query: "",
	tablename: "",
};
const [MariaDB, MSSQLServer, MySQL, Oracle, PostgreSQL] = [...Array(5)].map(
	() => SQLInitialData
);

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
	MariaDB,
	MSSQLServer,
	MySQL,
	Oracle,
	PostgreSQL,
};
