import { Dispatch, SetStateAction } from "react";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	makeStyles,
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

export const supportedPlatforms = [
	"BigQuery",
	"ElasticSearch",
	"EMR",
	"Kafka",
	"PubSub",
	"S3",
];

const useStyles = makeStyles((theme) => ({
	notSupported: {
		border: `1px solid ${theme.palette.error.main}`,
		borderRadius: theme.shape.borderRadius,
		fontWeight: "bold",
		padding: 4,
	},
}));

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
	const classes = useStyles();
	const handleClose = () => {
		setConfiguredNode(null);
	};

	return configuredNode ? ( // to prevent flickering the dialog with undefined values
		<Dialog onClose={handleClose} open={Boolean(configuredNode)}>
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
					<Typography
						className={classes.notSupported}
						color="error"
						variant="subtitle1"
					>
						This platform is not supported yet.
					</Typography>
				)}
			</DialogContent>
		</Dialog>
	) : null;
};

export default FormManagement;
