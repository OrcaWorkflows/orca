import { useState, useMemo } from "react";

import {
	Button,
	Divider,
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
}: {
	nodes: Elements;
	edges: Elements;
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
	const handleSubmitOnMouseOver = () => {
		if (name === "" || nodes.length === 0) setOpenSubmitTooltip(true);
	};
	const handleSubmitOnMouseOut = () => {
		setOpenSubmitTooltip(false);
	};

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

	const disabled = edges.length === 0; // No edges set which means there is not a valid workflow to handle

	return (
		<>
			<Grid container justifyContent="space-evenly" alignItems="center">
				<Grid item>
					<Tooltip
						open={openSubmitTooltip}
						placement="right"
						title={
							<Typography align="center" variant="caption">
								Please make sure to name your workflow and create edges to
								submit
							</Typography>
						}
					>
						<span
							onMouseOver={handleSubmitOnMouseOver}
							onMouseOut={handleSubmitOnMouseOut}
						>
							<Button
								className={classes.button}
								disabled={name === "" || disabled}
								onClick={() => {
									submitWorkflow({ workflow });
								}}
								variant="contained"
							>
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
								disabled={argoWorkflowName === "" || disabled}
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
								disabled={argoWorkflowName === "" || disabled}
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
								disabled={argoWorkflowName === "" || disabled}
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
								disabled={argoWorkflowName === "" || disabled}
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
