import * as nodeImages from "utils/node/nodeImages";

export const platforms = [
	{
		text: "Amazon Web Services",
		options: [
			{ type: "s3", icon: nodeImages.s3, supported: true, text: "S3" },
			{
				type: "dynamodb",
				icon: nodeImages.dynamodb,
				supported: true,
				text: "DynamoDB",
			},
			{
				type: "kinesis",
				icon: nodeImages.kinesis,
				supported: true,
				text: "Kinesis",
			},
			{ type: "emr", icon: nodeImages.emr, supported: true, text: "EMR" },
			{
				type: "lambda",
				icon: nodeImages.lambda,
				supported: true,
				text: "Lambda",
			},
			// {
			// 	type: "redshift",
			// 	icon: nodeImages.redshift,
			// 	supported: false,
			// 	text: "RedShift",
			// },
		],
	},
	{
		text: "SQL",
		options: [
			{
				type: "postgresql",
				icon: nodeImages.postgresql,
				supported: true,
				text: "PostgreSQL",
			},
			{
				type: "mysql",
				icon: nodeImages.mysql,
				supported: true,
				text: "MySQL",
			},
			{
				type: "mariadb",
				icon: nodeImages.mariadb,
				supported: true,
				text: "MariaDB",
			},
			{
				type: "oracle",
				icon: nodeImages.oracle,
				supported: true,
				text: "Oracle",
			},
			{
				type: "mssql",
				icon: nodeImages.mssql,
				supported: true,
				text: "MSSQLServer",
			},
		],
	},
	{
		text: "Google Cloud Platform",
		options: [
			{
				type: "pubsub",
				icon: nodeImages.pubsub,
				supported: true,
				text: "Pubsub",
			},
			{
				type: "bigquery",
				icon: nodeImages.bigquery,
				supported: true,
				text: "BigQuery",
			},
			{
				type: "dataproc",
				icon: nodeImages.dataproc,
				supported: false,
				text: "DataProc",
			},
			{
				type: "cloudfunctions",
				icon: nodeImages.cloudfunctions,
				supported: false,
				text: "CloudFunctions",
			},
			{
				type: "filestore",
				icon: nodeImages.filestore,
				supported: false,
				text: "FileStore",
			},
			{
				type: "memorystore",
				icon: nodeImages.memorystore,
				supported: false,
				text: "MemoryStore",
			},
		],
	},
	{
		text: "Apache Stack",
		options: [
			{ type: "kafka", icon: nodeImages.kafka, supported: true, text: "Kafka" },
			{
				type: "spark",
				icon: nodeImages.spark,
				supported: false,
				text: "Spark",
			},
			{
				type: "flink",
				icon: nodeImages.flink,
				supported: false,
				text: "Flink",
			},
			{ type: "pig", icon: nodeImages.pig, supported: false, text: "Pig" },
			{ type: "hive", icon: nodeImages.hive, supported: false, text: "Hive" },
		],
	},
	{
		text: "Elastic Stack",
		options: [
			{
				type: "elasticsearch",
				icon: nodeImages.elasticsearch,
				supported: true,
				text: "ElasticSearch",
			},
		],
	},
	{
		text: "MongoDB",
		options: [
			{
				type: "mongodb",
				icon: nodeImages.mongodb,
				supported: true,
				text: "MongoDB",
			},
		],
	},
	{
		text: "Redis",
		options: [
			{
				type: "redis",
				icon: nodeImages.redis,
				supported: true,
				text: "Redis",
			},
		],
	},
];
