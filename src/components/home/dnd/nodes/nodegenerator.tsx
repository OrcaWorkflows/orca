import { CSSProperties, NamedExoticComponent, memo } from "react";

import {
	Connection,
	Edge,
	Handle,
	NodeProps,
	Position,
} from "react-flow-renderer";

type types = {
	[key: string]: NamedExoticComponent<NodeProps>;
};
export let nodeTypes: types = {};

export const createNodes = () => {
	const nodes = [
		"S3",
		"Kafka",
		"Spark",
		"Elasticsearch",
		"DynamoDB",
		"Kinesis",
		"PubSub",
		"BigQuery",
		"DataLab",
		"DataFlow",
		"DataProc",
		"AppEngine",
		"CloudFunctions",
		"BigTable",
		"FileStore",
		"Lambda",
		"EMR",
		"RedShift",
		"SQS",
		"CloudSQL",
		"MemoryStore",
		"Flink",
		"Pig",
		"Hive",
		"Hadoop",
		"Impala",
		"Cassandra",
	];
	nodeTypes = {};
	for (const node of nodes) {
		nodeTypes[node] = memo(function Node() {
			const targetHandleStyle: CSSProperties = { background: "#555" };
			const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle };

			const onConnect = (params: Connection | Edge) =>
				console.log("handle onConnect", params);

			return (
				<>
					<Handle
						className={"operator-handle"}
						type="target"
						position={Position.Top}
						id="operator_target"
						style={targetHandleStyle}
						onConnect={onConnect}
					/>
					<div className={`node ${node.toLocaleLowerCase()}`} />
					<Handle
						className={"operator-handle"}
						type="source"
						position={Position.Bottom}
						id="operator_source"
						style={sourceHandleStyleA}
					/>
				</>
			);
		});
	}
	return nodeTypes;
};
