import { useState, useMemo, Dispatch, SetStateAction } from "react";

import {
	Button,
	Grid,
	makeStyles,
	Tooltip,
	Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { Elements } from "react-flow-renderer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router";

import {
	useResumeWorkflow,
	useStopWorkflow,
	useSubmitWorkflow,
	useSuspendWorkflow,
	useTerminateWorkflow,
} from "actions/workflowActions";
import { Alert, ServerError } from "components";
import { IWorkflow } from "interfaces";
import createWorkFlow from "utils/workflow/createWorkflow";
import { HomeParams } from "views/main/Home";

const useStyles = makeStyles((theme) => ({
	button: {
		fontWeight: theme.typography.fontWeightBold,
		textTransform: "none",
		"&:disabled": {
			border: "none",
		},
	},
}));

const TopBar = ({
	nodes,
	edges,
	setEnqueuedNodes,
}: {
	nodes: Elements;
	edges: Elements;
	setEnqueuedNodes?: Dispatch<SetStateAction<{ displayName: string }[]>>;
}): JSX.Element => {
	const classes = useStyles();
	const { workflowID } = useParams<HomeParams>();

	const queryClient = useQueryClient();
	const currentWorkflow = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	]);

	const name = currentWorkflow?.name ?? "";
	const argoWorkflowName = currentWorkflow?.argoWorkflowName ?? "";
	const workflow = useMemo(() => {
		return createWorkFlow(Number(workflowID), nodes, edges, name);
	}, [workflowID, nodes, edges, name]);

	const [openSubmitTooltip, setOpenSubmitTooltip] = useState(false);
	const [openSuspendTooltip, setOpenSuspend] = useState(false);
	const [openResumeTooltip, setOpenResumeTooltip] = useState(false);
	const [openStopTooltip, setOpenStopTooltip] = useState(false);
	const [openTerminateTooltip, setOpenTerminateTooltip] = useState(false);

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

	return (
		<>
			<Grid container justifyContent="space-evenly">
				<Grid item>
					<Tooltip
						open={openSubmitTooltip}
						placement="right"
						title={
							<Typography align="center" variant="caption">
								Please make sure to name your workflow and create at least one
								edge
							</Typography>
						}
					>
						<span
							onMouseOver={() => {
								if (name === "" || edges.length === 0)
									setOpenSubmitTooltip(true);
							}}
							onMouseOut={() => {
								setOpenSubmitTooltip(false);
							}}
						>
							<Button
								className={classes.button}
								disabled={name === "" || edges.length === 0}
								onClick={() => {
									submitWorkflow({ workflow });
									if (setEnqueuedNodes) setEnqueuedNodes([]);
								}}
								variant="contained"
							>
								{currentWorkflow && (currentWorkflow.submitted ? null : "*")}
								Submit
							</Button>
						</span>
					</Tooltip>
				</Grid>
				<Grid item>
					<Tooltip
						open={openSuspendTooltip}
						placement="right"
						title={
							<Typography align="center" variant="caption">
								Please make sure to submit your workflow first
							</Typography>
						}
					>
						<span
							onMouseOver={() => {
								if (argoWorkflowName === "") setOpenSuspend(true);
							}}
							onMouseOut={() => {
								setOpenSuspend(false);
							}}
						>
							<Button
								className={clsx(classes.button)}
								disabled={argoWorkflowName === ""}
								onClick={() =>
									suspendWorkflow({ argoWorkflowName } as {
										argoWorkflowName: string;
									})
								}
								variant="contained"
							>
								Suspend
							</Button>
						</span>
					</Tooltip>
				</Grid>
				<Grid item>
					<Tooltip
						open={openResumeTooltip}
						placement="right"
						title={
							<Typography align="center" variant="caption">
								Please make sure to submit your workflow first
							</Typography>
						}
					>
						<span
							onMouseOver={() => {
								if (argoWorkflowName === "") setOpenResumeTooltip(true);
							}}
							onMouseOut={() => {
								setOpenResumeTooltip(false);
							}}
						>
							<Button
								className={classes.button}
								disabled={argoWorkflowName === ""}
								onClick={() =>
									resumeWorkflow({ argoWorkflowName } as {
										argoWorkflowName: string;
									})
								}
								variant="contained"
							>
								Resume
							</Button>
						</span>
					</Tooltip>
				</Grid>
				<Grid item>
					<Tooltip
						open={openStopTooltip}
						placement="right"
						title={
							<Typography align="center" variant="caption">
								Please make sure to submit your workflow first
							</Typography>
						}
					>
						<span
							onMouseOver={() => {
								if (argoWorkflowName === "") setOpenStopTooltip(true);
							}}
							onMouseOut={() => {
								setOpenStopTooltip(false);
							}}
						>
							<Button
								className={classes.button}
								disabled={argoWorkflowName === ""}
								onClick={() =>
									stopWorkflow({ argoWorkflowName } as {
										argoWorkflowName: string;
									})
								}
								variant="contained"
							>
								Stop
							</Button>
						</span>
					</Tooltip>
				</Grid>
				<Grid item>
					<Tooltip
						open={openTerminateTooltip}
						placement="right"
						title={
							<Typography align="center" variant="caption">
								Please make sure to submit your workflow first
							</Typography>
						}
					>
						<span
							onMouseOver={() => {
								if (argoWorkflowName === "") setOpenTerminateTooltip(true);
							}}
							onMouseOut={() => {
								setOpenTerminateTooltip(false);
							}}
						>
							<Button
								className={classes.button}
								disabled={argoWorkflowName === ""}
								onClick={() =>
									terminateWorkflow({ argoWorkflowName } as {
										argoWorkflowName: string;
									})
								}
								variant="contained"
							>
								Terminate
							</Button>
						</span>
					</Tooltip>
				</Grid>
			</Grid>

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
