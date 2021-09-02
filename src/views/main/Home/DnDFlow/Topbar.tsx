import { useMemo } from "react";

import { Button, Divider, Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { Elements } from "react-flow-renderer";
import { useParams } from "react-router";

import {
	useResumeWorkflow,
	useStopWorkflow,
	useSubmitWorkflow,
	useSuspendWorkflow,
	useTerminateWorkflow,
} from "actions/workflowActions";
import { Alert, ServerError } from "components";
import createWorkFlow from "utils/workflow/createWorkflow";
import { HomeParams } from "views/main/Home";

const useStyles = makeStyles(() => ({
	button: {
		fontWeight: "bold",
		textTransform: "none",
		"&:disabled": {
			border: "none",
		},
	},
}));

const TopBar = ({
	nodes,
	edges,
	argoWorkflowName,
}: {
	nodes: Elements;
	edges: Elements;
	argoWorkflowName: string | null;
}): JSX.Element => {
	const classes = useStyles();
	const { workflowID } = useParams<HomeParams>();

	const workflow = useMemo(() => {
		return createWorkFlow(Number(workflowID), nodes, edges, argoWorkflowName);
	}, [workflowID, nodes, edges, argoWorkflowName]);

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

	const disabled = edges.length === 0; // No edges set which means there is not a valid workflow to handle

	return (
		<>
			<Grid container justifyContent="space-evenly" alignItems="center">
				<Grid item>
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
				<Grid item>
					<Button
						className={clsx(classes.button)}
						disabled={disabled}
						onClick={() => suspendWorkflow({ argoWorkflowName })}
						variant="contained"
					>
						Suspend
					</Button>
				</Grid>
				<Grid item>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => resumeWorkflow({ argoWorkflowName })}
						variant="contained"
					>
						Resume
					</Button>
				</Grid>
				<Grid item>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => stopWorkflow({ argoWorkflowName })}
						variant="contained"
					>
						Stop
					</Button>
				</Grid>
				<Grid item>
					<Button
						className={classes.button}
						disabled={disabled}
						onClick={() => terminateWorkflow({ argoWorkflowName })}
						variant="contained"
					>
						Terminate
					</Button>
				</Grid>
			</Grid>
			<Divider />
			{isErrorSubmit && <ServerError />}
			{isErrorSuspend && <ServerError />}
			{isErrorResume && <ServerError />}
			{isErrorStop && <ServerError />}
			{isErrorTerminate && <ServerError />}
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
		</>
	);
};

export default TopBar;
