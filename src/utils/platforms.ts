import * as nodeImages from "utils/node/nodeImages";

export const platforms = [
	{
		text: "Amazon Web Services",
		options: [
			{ type: "S3", icon: nodeImages.S3, supported: true },
			{ type: "DynamoDB", icon: nodeImages.DynamoDB, supported: true },
			{ type: "Kinesis", icon: nodeImages.Kinesis, supported: true },
			{ type: "EMR", icon: nodeImages.EMR, supported: true },
			{ type: "Lambda", icon: nodeImages.Lambda, supported: false },
			{ type: "RedShift", icon: nodeImages.RedShift, supported: false },
		],
	},
	{
		text: "SQL",
		options: [
			{
				type: "PostgreSQL",
				icon: nodeImages.PostgreSQL,
				supported: true,
			},
			{
				type: "MySQL",
				icon: nodeImages.MySQL,
				supported: true,
			},
			{
				type: "MariaDB",
				icon: nodeImages.MariaDB,
				supported: true,
			},
			{
				type: "Oracle",
				icon: nodeImages.Oracle,
				supported: true,
			},
			{
				type: "MSSQLServer",
				icon: nodeImages.MSSQLServer,
				supported: true,
			},
		],
	},
	{
		text: "Google Cloud Platform",
		options: [
			{ type: "PubSub", icon: nodeImages.PubSub, supported: true },
			{ type: "BigQuery", icon: nodeImages.BigQuery, supported: true },
			{ type: "DataProc", icon: nodeImages.DataProc, supported: false },
			{
				type: "CloudFunctions",
				icon: nodeImages.CloudFunctions,
				supported: false,
			},
			{ type: "FileStore", icon: nodeImages.FileStore, supported: false },
			{ type: "MemoryStore", icon: nodeImages.MemoryStore, supported: false },
		],
	},
	{
		text: "Apache Stack",
		options: [
			{ type: "Kafka", icon: nodeImages.Kafka, supported: true },
			{ type: "Spark", icon: nodeImages.Spark, supported: false },
			{ type: "Flink", icon: nodeImages.Flink, supported: false },
			{ type: "Pig", icon: nodeImages.Pig, supported: false },
			{ type: "Hive", icon: nodeImages.Hive, supported: false },
		],
	},
	{
		text: "Elastic Stack",
		options: [
			{
				type: "ElasticSearch",
				icon: nodeImages.ElasticSearch,
				supported: true,
			},
		],
	},
	{
		text: "MongoDB",
		options: [
			{
				type: "MongoDB",
				icon: nodeImages.MongoDB,
				supported: true,
			},
		],
	},
	{
		text: "Redis",
		options: [
			{
				type: "Redis",
				icon: nodeImages.Redis,
				supported: true,
			},
		],
	},
];
