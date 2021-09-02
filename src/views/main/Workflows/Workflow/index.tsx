import { useState } from "react";

import {
	Card,
	Paper,
	CardContent,
	IconButton,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { Edit, MoreVertical, Trash2 } from "react-feather";
import { ReactFlowProvider } from "react-flow-renderer";
import { useHistory } from "react-router";

import { useDeleteWorkflow } from "actions/workflowActions";
import { ServerError, TextDialog } from "components";
import { IWorkflow } from "interfaces";
import Flow from "views/main/Workflows/Workflow/Flow";

const useStyles = makeStyles((theme) => ({
	card: {
		backfaceVisibility: "hidden",
		WebkitBackfaceVisibility: "hidden",
		position: "relative",
		transition: theme.transitions.create(["transform"], {
			easing: theme.transitions.easing.sharp,
		}),
		"&:hover": {
			transform: "scale3d(1.04, 1.04, 1.04)",
		},
		"&:hover $actions": {
			opacity: 1,
			visibility: "visible",
		},
	},
	actions: {
		backgroundColor: theme.palette.action.hover,
		color: theme.palette.secondary.main,
		visibility: "hidden",
		opacity: 0,
		transition: theme.transitions.create(["opacity", "visibility"], {
			easing: theme.transitions.easing.easeOut,
		}),
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		transform: "scale3d(1.04, 1.04, 1.04)",
		position: "absolute",
		bottom: 0,
		padding: 10,
		width: "100%",
		zIndex: 5,
		"& > *": { marginRight: 10 },
	},
	name: {
		position: "absolute",
		left: 5,
		top: 5,
		fontWeight: theme.typography.fontWeightBold,
	},
}));

const Workflow = ({ workflow }: { workflow: IWorkflow }): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();

	const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
	const { isError: deleteWorkflowError, mutate } = useDeleteWorkflow();

	return (
		<>
			<Card className={classes.card} raised>
				<CardContent>
					<ReactFlowProvider>
						<Flow workflow={workflow} />
					</ReactFlowProvider>
				</CardContent>
				<Typography className={classes.name} variant="caption">
					Workflow - {workflow.id}
				</Typography>
				<Paper className={classes.actions}>
					<IconButton></IconButton>
					<IconButton size="small" onClick={() => setOpenRemoveDialog(true)}>
						<Trash2 size={20} />
					</IconButton>
					<IconButton
						size="small"
						onClick={() => history.push(`home/${workflow.id}`)}
					>
						<Edit size={20} />
					</IconButton>
					<IconButton size="small" onClick={() => console.log("more")}>
						<MoreVertical size={20} />
					</IconButton>
				</Paper>
			</Card>
			<TextDialog
				open={openRemoveDialog}
				onClose={() => setOpenRemoveDialog(false)}
				onConfirm={() => {
					mutate({ id: workflow.id });
					setOpenRemoveDialog(false);
				}}
				title="Remove workflow"
				text={`Are you sure to remove Workflow - ${workflow.id}?`}
			/>
			{deleteWorkflowError && <ServerError />}
		</>
	);
};

export default Workflow;
