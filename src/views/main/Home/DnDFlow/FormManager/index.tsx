import { Dispatch, SetStateAction } from "react";

import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Elements, Node } from "react-flow-renderer";

import {
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
	SQL,
} from "views/main/Home/nodeForms";

const FormManager = ({
	configuredNode,
	setConfiguredNode,
	nodes,
	edges,
}: {
	configuredNode: Node | null;
	setConfiguredNode: Dispatch<SetStateAction<Node | null>>;
	nodes: Elements;
	edges: Elements;
}): JSX.Element | null => {
	const handleClose = () => {
		setConfiguredNode(null);
	};

	return (
		<Dialog onClose={handleClose} open={!!configuredNode}>
			{configuredNode && (
				<>
					<DialogTitle>{`${configuredNode.id} Config`}</DialogTitle>
					<DialogContent>
						{configuredNode.type === "BigQuery" && (
							<BigQuery
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "DynamoDB" && (
							<DynamoDB
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "ElasticSearch" && (
							<ElasticSearch
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "EMR" && (
							<EMR
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "Kafka" && (
							<Kafka
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "Kinesis" && (
							<Kinesis
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "MongoDB" && (
							<MongoDB
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "PubSub" && (
							<PubSub
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "Redis" && (
							<Redis
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{configuredNode.type === "S3" && (
							<S3
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
						{(configuredNode.type === "PostgreSQL" ||
							configuredNode.type === "MySQL" ||
							configuredNode.type === "MariaDB" ||
							configuredNode.type === "Oracle" ||
							configuredNode.type === "MSSQLServer") && (
							<SQL
								configuredNode={configuredNode}
								handleClose={handleClose}
								nodes={nodes}
								edges={edges}
							/>
						)}
					</DialogContent>
				</>
			)}
		</Dialog>
	);
};

export default FormManager;
