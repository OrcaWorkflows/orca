import { DragEvent } from "react";

import { List } from "@material-ui/core";

import CollapsibleStack from "components/CollapsibleStack";
import * as nodeImages from "views/main/home/node/nodeImages";

const techStackData = [
	{
		text: "Amazon Web Services",
		options: [
			{ text: "S3", icon: nodeImages.S3 },
			{ text: "DynamoDB", icon: nodeImages.DynamoDB },
			{ text: "Kinesis", icon: nodeImages.Kinesis },
			{ text: "Lambda", icon: nodeImages.Lambda },
			{ text: "EMR", icon: nodeImages.EMR },
			{ text: "RedShift", icon: nodeImages.RedShift },
			{ text: "SQS", icon: nodeImages.SQS },
		],
	},
	{
		text: "Google Cloud Platform",
		options: [
			{ text: "PubSub", icon: nodeImages.PubSub },
			{ text: "BigQuery", icon: nodeImages.BigQuery },
			{ text: "DataFlow", icon: nodeImages.DataFlow },
			{ text: "DataProc", icon: nodeImages.DataProc },
			{ text: "AppEngine", icon: nodeImages.AppEngine },
			{ text: "CloudFunctions", icon: nodeImages.CloudFunctions },
			{ text: "BigTable", icon: nodeImages.BigTable },
			{ text: "FileStore", icon: nodeImages.FileStore },
			{ text: "CloudSQL", icon: nodeImages.CloudSQL },
			{ text: "MemoryStore", icon: nodeImages.MemoryStore },
		],
	},
	{
		text: "Apache Stack",
		options: [
			{ text: "Kafka", icon: nodeImages.Kafka },
			{ text: "Spark", icon: nodeImages.Spark },
			{ text: "Flink", icon: nodeImages.Flink },
			{ text: "Pig", icon: nodeImages.Pig },
			{ text: "Hive", icon: nodeImages.Hive },
			{ text: "Hadoop", icon: nodeImages.Hadoop },
			{ text: "Impala", icon: nodeImages.Impala },
			{ text: "Cassandra", icon: nodeImages.Cassandra },
		],
	},
	{
		text: "Elastic Stack",
		options: [{ text: "ElasticSearch", icon: nodeImages.ElasticSearch }],
	},
];

const Sidebar = (): JSX.Element => {
	const onDragStart = (event: DragEvent<Element>, data: string): void => {
		event.dataTransfer.setData("application/reactflow", data);
		event.dataTransfer.effectAllowed = "move";
	};
	return (
		<List>
			{techStackData.map((stackData) => (
				<CollapsibleStack
					data={stackData}
					draggable
					onDragStart={onDragStart}
					key={stackData.text}
				/>
			))}
		</List>
	);
};

export default Sidebar;
