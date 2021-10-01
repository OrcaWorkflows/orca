const bigquery = {
	config: null,
	project_id: "akis-295110",
	dataset_id: "",
	table_id: "",
	query: "",
};
const dynamodb = {
	config: null,
	table_name: "",
	batch_size: 1000,
};
const elasticsearch = {
	config: null,
	index_name: "",
};
const emr = {
	config: null,
	script_uri: "",
	input_uri: "",
	master_instance_type: "m5.xlarge",
	slave_instance_type: "m5.xlarge",
	instance_count: 3,
};
const kafka = {
	config: null,
	topic_name: "",
};
const kinesis = { config: null, stream_name: "" };
const lambda = {
	function_name: "",
	runtime: "",
	role: "",
	handler: "",
	code_s3_bucket: "",
	code_s3_key: "",
	payload: "",
};
const mongodb = {
	config: null,
	database_name: "",
	collection_name: "",
};
const pubsub = {
	config: null,
	project_id: "akis-295110",
	topic: "",
	topic_action: "",
};
const redis = {
	config: null,
	database: "",
};
const s3 = {
	config: null,
	bucket_name: "",
	file_path: "",
	file_type: "",
};

const sqlInitialData = {
	config: null,
	databasename: "",
	query: "",
	tablename: "",
};
const [mariadb, mssql, mysql, oracle, postgresql] = [...Array(5)].map(
	() => sqlInitialData
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
};
