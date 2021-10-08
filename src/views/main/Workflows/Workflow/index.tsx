import { useState } from "react";

import {
	Box,
	Card,
	CardActionArea,
	CircularProgress,
	Paper,
	IconButton,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { ReactFlowProvider } from "react-flow-renderer";
import { FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import { useDeleteWorkflow } from "actions/workflowActions";
import { ServerError, TextDialog } from "components";
import { IWorkflow } from "interfaces";
import Flow from "views/main/Workflows/Workflow/Flow";

const useStyles = makeStyles((theme) => ({
	card: {
		backfaceVisibility: "hidden",
		WebkitBackfaceVisibility: "hidden",
		display: "flex", // To center CircularProgress
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
		height: 200,
		width: 300,
	},
	cardActionArea: { height: "100%", width: "100%" },
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
	id: {
		position: "absolute",
		right: 5,
		top: 5,
		fontWeight: theme.typography.fontWeightLight,
	},
}));

const Workflow = ({ workflow }: { workflow: IWorkflow }): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();

	const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
	const {
		isError: isErrorDeleteWorkflow,
		isLoading: isLoadingDeleteWorkflow,
		mutate,
	} = useDeleteWorkflow();

	const handleDirectToWorkflowClick = () => history.push(`home/${workflow.id}`);

	return (
		<>
			<Card className={classes.card} raised>
				{isLoadingDeleteWorkflow ? (
					<Box margin="auto">
						<CircularProgress />
					</Box>
				) : (
					<CardActionArea
						className={classes.cardActionArea}
						onClick={handleDirectToWorkflowClick}
					>
						{/* Provider is required for fitView to function on load */}
						<ReactFlowProvider>
							<Flow workflow={workflow} />
						</ReactFlowProvider>
					</CardActionArea>
				)}
				<Typography className={classes.name} variant="caption">
					{workflow.name}
				</Typography>
				<Typography className={classes.id} variant="caption">
					Workflow - {workflow.id}
				</Typography>
				<Paper className={classes.actions}>
					<IconButton size="small" onClick={() => setOpenRemoveDialog(true)}>
						<FiTrash2 size={20} />
					</IconButton>
					<IconButton
						size="small"
						onClick={() => history.push(`home/${workflow.id}`)}
					>
						<FiEdit size={20} />
					</IconButton>
					<IconButton size="small" onClick={() => console.log("more")}>
						<FiMoreVertical size={20} />
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
			{isErrorDeleteWorkflow && <ServerError />}
		</>
	);
};

export default Workflow;
