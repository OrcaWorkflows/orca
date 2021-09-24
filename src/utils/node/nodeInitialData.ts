const bigquery = {
	config: { id: null, name: "" },
	project_id: "akis-295110",
	dataset_id: "",
	table_id: "",
	query: "",
};
const dynamodb = {
	config: { id: null, name: "" },
	table_name: "",
	batch_size: 1000,
};
const elasticsearch = {
	config: { id: null, name: "" },
	index_name: "",
};
const emr = {
	config: { id: null, name: "" },
	script_uri: "",
	input_uri: "",
	master_instance_type: "m5.xlarge",
	slave_instance_type: "m5.xlarge",
	instance_count: 3,
};
const kafka = {
	config: { id: null, name: "" },
	topic_name: "",
};
const kinesis = { config: { id: null, name: "" }, stream_name: "" };
const mongodb = {
	config: { id: null, name: "" },
	database_name: "",
	collection_name: "",
};
const pubsub = {
	config: { id: null, name: "" },
	project_id: "akis-295110",
	topic: "",
	topic_action: "",
};
const redis = {
	config: { id: null, name: "" },
	database: "",
};
const s3 = {
	config: { id: null, name: "" },
	bucket_name: "",
	file_path: "",
	file_type: "",
};

const sqlInitialData = {
	config: { id: null, name: "" },
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
