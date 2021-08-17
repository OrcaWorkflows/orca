import { Dispatch, SetStateAction } from "react";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	Typography,
} from "@material-ui/core";
import { Elements, Node } from "react-flow-renderer";

import {
	BigQuery,
	ElasticSearch,
	EMR,
	Kafka,
	PubSub,
	S3,
} from "views/main/home/nodeForms";

const supportedPlatforms = [
	"BigQuery",
	"ElasticSearch",
	"EMR",
	"Kafka",
	"PubSub",
	"S3",
];

const FormManagement = ({
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

	return configuredNode ? ( // to prevent flickering the dialog with undefined values
		<Dialog onClose={handleClose} open={Boolean(configuredNode)}>
			<DialogTitle>
				{`${configuredNode.id} Config`}
				<Typography
					display="block"
					gutterBottom
					color="textSecondary"
					variant="caption"
				>
					(Backspace to remove the node)
				</Typography>
			</DialogTitle>
			<DialogContent>
				{configuredNode.type === "BigQuery" && (
					<BigQuery
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
				{configuredNode.type === "PubSub" && (
					<PubSub
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
				{!supportedPlatforms.includes(configuredNode.type as string) && (
					<Typography color="error">
						This platform is not supported yet.
					</Typography>
				)}
			</DialogContent>
		</Dialog>
	) : null;
};

export default FormManagement;
