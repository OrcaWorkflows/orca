import * as nodeImages from "utils/node/nodeImages";

export const platforms = [
	{
		text: "Amazon Web Services",
		options: [
			{ text: "S3", icon: nodeImages.S3, supported: true },
			{ text: "DynamoDB", icon: nodeImages.DynamoDB, supported: true },
			{ text: "Kinesis", icon: nodeImages.Kinesis, supported: true },
			{ text: "EMR", icon: nodeImages.EMR, supported: true },
			{ text: "Lambda", icon: nodeImages.Lambda, supported: false },
			{ text: "RedShift", icon: nodeImages.RedShift, supported: false },
		],
	},
	{
		text: "Google Cloud Platform",
		options: [
			{ text: "PubSub", icon: nodeImages.PubSub, supported: true },
			{ text: "BigQuery", icon: nodeImages.BigQuery, supported: true },
			{ text: "DataProc", icon: nodeImages.DataProc, supported: false },
			{
				text: "CloudFunctions",
				icon: nodeImages.CloudFunctions,
				supported: false,
			},
			{ text: "FileStore", icon: nodeImages.FileStore, supported: false },
			{ text: "MemoryStore", icon: nodeImages.MemoryStore, supported: false },
		],
	},
	{
		text: "Apache Stack",
		options: [
			{ text: "Kafka", icon: nodeImages.Kafka, supported: true },
			{ text: "Spark", icon: nodeImages.Spark, supported: false },
			{ text: "Flink", icon: nodeImages.Flink, supported: false },
			{ text: "Pig", icon: nodeImages.Pig, supported: false },
			{ text: "Hive", icon: nodeImages.Hive, supported: false },
		],
	},
	{
		text: "Elastic Stack",
		options: [
			{
				text: "ElasticSearch",
				icon: nodeImages.ElasticSearch,
				supported: true,
			},
		],
	},
	{
		text: "MongoDB",
		options: [
			{
				text: "MongoDB",
				icon: nodeImages.MongoDB,
				supported: true,
			},
		],
	},
	{
		text: "Redis",
		options: [
			{
				text: "Redis",
				icon: nodeImages.Redis,
				supported: true,
			},
		],
	},
];
