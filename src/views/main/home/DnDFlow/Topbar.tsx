import { useMemo } from "react";

import { Button, Divider, Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { Elements } from "react-flow-renderer";
import { useParams } from "react-router";

import {
	useDeleteWorkflow,
	useResumeWorkflow,
	useStopWorkflow,
	useSubmitWorkflow,
	useSuspendWorkflow,
	useTerminateWorkflow,
} from "actions/workflowActions";
import { Alert, ServerError } from "components";
import { HomeParams } from "views/main/home";
import createWorkFlow from "views/main/home/workflow/createWorkflow";
import useValidateNodes from "views/main/home/workflow/useValidateNodes";

const useStyles = makeStyles((theme) => ({
	button: {
		border: `2px solid ${theme.palette.secondary.dark}`,
		fontWeight: "bold",
		textTransform: "none",
		"&:disabled": {
			border: "none",
		},
	},
	buttonWrapper: {
		cursor: "not-allowed",
	},
}));

const TopBar = ({
	nodes,
	edges,
	workflowName,
}: {
	nodes: Elements;
	edges: Elements;
	workflowName: string | null;
}): JSX.Element => {
	const classes = useStyles();
	const { canvasID } = useParams<HomeParams>();

	const [nodeValidationErrors] = useValidateNodes(nodes);
	const workflow = useMemo(() => {
		return createWorkFlow(Number(canvasID), nodes, edges, workflowName);
	}, [canvasID, nodes, edges, workflowName]);

	const {
		mutate: submitWorkflow,
		isError: isErrorSubmit,
		isSuccess: isSuccessSubmit,
	} = useSubmitWorkflow();
	const {
		mutate: suspendWorkflow,
		isError: isErrorSuspend,
		isSuccess: isSuccessSuspend,
	} = useSuspendWorkflow();
	const {
		mutate: resumeWorkflow,
		isError: isErrorResume,
		isSuccess: isSuccessResume,
	} = useResumeWorkflow();
	const {
		mutate: stopWorkflow,
		isError: isErrorStop,
		isSuccess: isSuccessStop,
	} = useStopWorkflow();
	const {
		mutate: terminateWorkflow,
		isError: isErrorTerminate,
		isSuccess: isSuccessTerminate,
	} = useTerminateWorkflow();
	const {
		mutate: deleteWorkflow,
		isError: isErrorDelete,
		isSuccess: isSuccessDelete,
	} = useDeleteWorkflow();

	const disabled =
		!!Object.keys(nodeValidationErrors).length || edges.length === 0; //Validation errors or no edges set
	return (
		<>
			<Grid container justifyContent="space-evenly" alignItems="center">
				<Grid item className={classes.buttonWrapper}>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => {
							submitWorkflow({ workflow });
						}}
						variant="contained"
					>
						Submit
					</Button>
				</Grid>
				<Grid item className={classes.buttonWrapper}>
					<Button
						className={clsx(classes.button)}
						disabled={disabled}
						onClick={() => suspendWorkflow({ workflowName: workflow.name })}
						variant="contained"
					>
						Suspend
					</Button>
				</Grid>
				<Grid item className={classes.buttonWrapper}>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => resumeWorkflow({ workflowName: workflow.name })}
						variant="contained"
					>
						Resume
					</Button>
				</Grid>
				<Grid item className={classes.buttonWrapper}>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => stopWorkflow({ workflowName: workflow.name })}
						variant="contained"
					>
						Stop
					</Button>
				</Grid>
				<Grid item className={classes.buttonWrapper}>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => terminateWorkflow({ workflowName: workflow.name })}
						variant="contained"
					>
						Terminate
					</Button>
				</Grid>
				<Grid item className={classes.buttonWrapper}>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => deleteWorkflow({ workflowName: workflow.name })}
						variant="contained"
					>
						Delete
					</Button>
				</Grid>
			</Grid>
			<Divider />
			{Object.keys(nodeValidationErrors).length !== 0 && (
				<Alert
					autoHideDuration={null}
					message={nodeValidationErrors}
					severity="warning"
				/>
			)}
			{isErrorSubmit && <ServerError />}
			{isErrorSuspend && <ServerError />}
			{isErrorResume && <ServerError />}
			{isErrorStop && <ServerError />}
			{isErrorTerminate && <ServerError />}
			{isErrorDelete && <ServerError />}
			{isSuccessSubmit && (
				<Alert
					autoHideDuration={3000}
					message="Submitted successfuly!"
					severity="success"
				/>
			)}
			{isSuccessSuspend && (
				<Alert
					autoHideDuration={3000}
					message="Suspended successfully!"
					severity="success"
				/>
			)}
			{isSuccessResume && (
				<Alert
					autoHideDuration={3000}
					message="Resumed successfully!"
					severity="success"
				/>
			)}
			{isSuccessStop && (
				<Alert
					autoHideDuration={3000}
					message="Stopped successfully!"
					severity="success"
				/>
			)}
			{isSuccessTerminate && (
				<Alert
					autoHideDuration={3000}
					message="Terminated successfully!"
					severity="success"
				/>
			)}
			{isSuccessDelete && (
				<Alert
					autoHideDuration={3000}
					message="Deleted successfully!"
					severity="success"
				/>
			)}
		</>
	);
};

export default TopBar;
