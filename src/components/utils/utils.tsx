import { Edge, Elements, FlowElement, Node } from "react-flow-renderer";
import { NotificationManager } from "react-notifications";

import { notificationTimeoutMillis } from "../../config";
import { SEPARATOR } from "../../index";
import { Task } from "../data/interface";
import State, {
	BigQueryConf,
	ElasticsearchConf,
	EMRConf,
	KafkaConf,
	PubSubConf,
	S3Conf,
} from "../data/state";

function isConfGiven(nodes: Elements, index: number): boolean {
	const nodeName = nodes[index].id;
	if (
		nodeName.indexOf("S3") >= 0 &&
		Object.prototype.hasOwnProperty.call(nodes[index].data.conf, "bucket_name")
	) {
		return true;
	} else if (
		nodeName.indexOf("EMR") >= 0 &&
		Object.prototype.hasOwnProperty.call(nodes[index].data.conf, "script_uri")
	) {
		return true;
	} else if (
		nodeName.indexOf("Kafka") >= 0 &&
		Object.prototype.hasOwnProperty.call(nodes[index].data.conf, "broker_host")
	) {
		return true;
	} else if (
		nodeName.indexOf("Elasticsearch") >= 0 &&
		Object.prototype.hasOwnProperty.call(nodes[index].data.conf, "host")
	) {
		return true;
	} else if (
		nodeName.indexOf("PubSub") >= 0 &&
		Object.prototype.hasOwnProperty.call(nodes[index].data.conf, "topic")
	) {
		return true;
	} else if (
		nodeName.indexOf("BigQuery") >= 0 &&
		Object.prototype.hasOwnProperty.call(nodes[index].data.conf, "table_id")
	) {
		return true;
	}
	NotificationManager.error(
		"You have not configured " + nodeName + " Node",
		"Error",
		notificationTimeoutMillis
	);
	return false;
}

function appendRequiredVariables(
	nodes: Elements,
	task: Task,
	name: string,
	index: number
) {
	if (name.indexOf("S3") >= 0) {
		task.arguments.parameters.push({
			name: "AWS_S3_BUCKET_NAME",
			value: (nodes[index].data.conf as S3Conf).bucket_name,
		});
		task.arguments.parameters.push({
			name: "AWS_S3_FILE_PATH",
			value: (nodes[index].data.conf as S3Conf).file_path,
		});
		task.arguments.parameters.push({
			name: "AWS_S3_FILE_TYPE",
			value: (nodes[index].data.conf as S3Conf).file_type,
		});
	} else if (name.indexOf("EMR") >= 0) {
		task.arguments.parameters.push({
			name: "AWS_EMR_STEP_SCRIPT_URI",
			value: (nodes[index].data.conf as EMRConf).script_uri,
		});
		task.arguments.parameters.push({
			name: "AWS_EMR_STEP_INPUT_URI",
			value: (nodes[index].data.conf as EMRConf).input_uri,
		});
		task.arguments.parameters.push({
			name: "AWS_EMR_MASTER_INSTANCE_TYPE",
			value: (nodes[index].data.conf as EMRConf).master_instance_type,
		});
		task.arguments.parameters.push({
			name: "AWS_EMR_SLAVE_INSTANCE_TYPE",
			value: (nodes[index].data.conf as EMRConf).slave_instance_type,
		});
		task.arguments.parameters.push({
			name: "AWS_EMR_INSTANCE_COUNT",
			value: (nodes[index].data.conf as EMRConf).instance_count,
		});
	} else if (name.indexOf("Kafka") >= 0) {
		task.arguments.parameters.push({
			name: "BOOTSTRAP_SERVERS",
			value: (nodes[index].data.conf as KafkaConf).broker_host,
		});
		task.arguments.parameters.push({
			name: "KAFKA_TOPIC",
			value: (nodes[index].data.conf as KafkaConf).topic_name,
		});
	} else if (name.indexOf("Elasticsearch") >= 0) {
		task.arguments.parameters.push({
			name: "ELASTICSEARCH_HOST",
			value: (nodes[index].data.conf as ElasticsearchConf).host,
		});
		task.arguments.parameters.push({
			name: "ELASTICSEARCH_INDEX",
			value: (nodes[index].data.conf as ElasticsearchConf).index_name,
		});
	} else if (name.indexOf("PubSub") >= 0) {
		task.arguments.parameters.push({
			name: "GOOGLE_PUBSUB_PROJECT_ID",
			value: (nodes[index].data.conf as PubSubConf).project_id,
		});
		task.arguments.parameters.push({
			name: "GOOGLE_PUBSUB_TOPIC",
			value: (nodes[index].data.conf as PubSubConf).topic,
		});
		task.arguments.parameters.push({
			name: "GOOGLE_PUBSUB_TOPIC_ACTION",
			value: (nodes[index].data.conf as PubSubConf).topic_action,
		});
	} else if (name.indexOf("BigQuery") >= 0) {
		task.arguments.parameters.push({
			name: "GOOGLE_BIGQUERY_PROJECT_ID",
			value: (nodes[index].data.conf as BigQueryConf).project_id,
		});
		task.arguments.parameters.push({
			name: "GOOGLE_BIGQUERY_DATASET_ID",
			value: (nodes[index].data.conf as BigQueryConf).dataset_id,
		});
		task.arguments.parameters.push({
			name: "GOOGLE_BIGQUERY_TABLE_ID",
			value: (nodes[index].data.conf as BigQueryConf).table_id,
		});
		task.arguments.parameters.push({
			name: "GOOGLE_BIGQUERY_QUERY",
			value: (nodes[index].data.conf as BigQueryConf).query,
		});
	}
}

function taskGenerator(
	nodes: Elements,
	edge: Edge,
	dependencies: Array<string>,
	sourceIndex: number,
	targetIndex: number
) {
	const taskName = edge.source + SEPARATOR + edge.target;
	const task: Task = {
		name: taskName,
		dependencies: dependencies,
		templateRef: {
			name: "orca-operators",
			template: "orca-operators",
		},
		arguments: {
			parameters: [
				{
					name: "OPERATOR_SOURCE",
					value: edge.source.toLowerCase().split(SEPARATOR)[0],
				},
				{
					name: "OPERATOR_TARGET",
					value: edge.target.toLowerCase().split(SEPARATOR)[0],
				},
			],
		},
	};

	appendRequiredVariables(nodes, task, edge.source, sourceIndex);
	appendRequiredVariables(nodes, task, edge.target, targetIndex);
	return task;
}

export function createTaskForEdge(
	nodes: Elements,
	edges: Elements,
	edge: Edge
) {
	const sourceIndex = nodes.findIndex(
		(node: FlowElement) => (node as Node).id === edge.source
	);
	const targetIndex = nodes.findIndex(
		(node: FlowElement) => (node as Node).id === edge.target
	);
	if (!isConfGiven(nodes, sourceIndex) || !isConfGiven(nodes, targetIndex)) {
		throw new Error();
	}
	const dependencies: Array<string> = [];
	edges.forEach((e) => {
		if (edge.source === (e as Edge).target) {
			dependencies.push((e as Edge).source + SEPARATOR + (e as Edge).target);
		}
	});
	State.tasks.push(
		taskGenerator(nodes, edge, dependencies, sourceIndex, targetIndex)
	);
}
