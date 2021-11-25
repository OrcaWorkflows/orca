import { Dispatch, SetStateAction } from "react";

import {
	Box,
	CircularProgress,
	Drawer,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { format } from "date-fns";
import { useStoreActions } from "react-flow-renderer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { useLogOfPod } from "actions/workflowActions";
// import { ServerError } from "components";
import { IWorkflow } from "interfaces";
import { HomeParams } from "views/main/Home";

const useStyles = makeStyles((theme) => ({
	border: { margin: "auto", opacity: 0.5 },
	phase: {
		color: ({ phase }: { phase: string }) =>
			phase === "Pending"
				? theme.palette.primary.main
				: phase === "Running"
				? theme.palette.info.main
				: phase === "Succeeded"
				? theme.palette.success.main
				: phase === "Failed"
				? theme.palette.error.main
				: phase === "Omitted"
				? theme.palette.primary.main
				: "unset",
	},
	log: {
		padding: theme.spacing(2),
		width: "30%",
	},
	bold: {
		fontWeight: theme.typography.fontWeightBold,
	},
}));

const WorkflowLog = ({
	selectedEdgeCustomID,
	openLog,
	setOpenLog,
	podName,
}: {
	selectedEdgeCustomID: string;
	openLog: boolean;
	setOpenLog: Dispatch<SetStateAction<boolean>>;
	podName: string | undefined;
}): JSX.Element => {
	const { workflowID } = useParams<HomeParams>();

	const queryClient = useQueryClient();
	const currentWorkflow = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	]);
	const argoWorkflowName = currentWorkflow?.argoWorkflowName ?? "";

	const status = queryClient.getQueryData<any>([
		`workflow/info/status`,
		argoWorkflowName,
	]);

	// "nodes" actually stands for the edges, it's just how endpoint indicates them
	const currentEdgeStatus: any = Object.values(status?.nodes ?? {}).find(
		(node: any) => node.displayName === selectedEdgeCustomID
	);
	const classes = useStyles({ phase: currentEdgeStatus?.phase });

	const {
		// isError: isErrorLog,
		data: logData,
		isLoading: isLoadingLog,
	} = useLogOfPod(
		{
			argoWorkflowName,
			podName,
		},
		Boolean(podName)
	);

	const resetSelectedElements = useStoreActions(
		(actions) => actions.resetSelectedElements
	);

	return (
		<>
			<Drawer
				PaperProps={{ className: classes.log }}
				anchor="right"
				open={openLog}
				onClose={() => {
					setOpenLog(false);
					resetSelectedElements();
				}}
			>
				<Typography variant="h5" gutterBottom>
					{selectedEdgeCustomID}
				</Typography>
				{currentEdgeStatus && (
					<>
						<Typography
							className={classes.bold}
							variant="subtitle1"
							gutterBottom
						>
							Phase:{" "}
							<span className={classes.phase}>{currentEdgeStatus?.phase}</span>
						</Typography>
						<Typography
							className={classes.bold}
							variant="subtitle1"
							gutterBottom
						>
							Started at:{" "}
							{currentEdgeStatus?.startedAt
								? format(
										new Date(currentEdgeStatus.startedAt as string),
										"HH:mm dd-MMM-yy"
								  )
								: "-"}
						</Typography>
						<Typography
							className={classes.bold}
							variant="subtitle1"
							gutterBottom
						>
							Finished at:{" "}
							{currentEdgeStatus?.finishedAt
								? format(
										new Date(currentEdgeStatus.finishedAt as string),
										"HH:mm dd-MMM-yy"
								  )
								: "-"}
						</Typography>
					</>
				)}
				{podName ? (
					isLoadingLog ? (
						<Box m="auto">
							<CircularProgress />
						</Box>
					) : logData && typeof(logData) === "string" ? (
						<>
							{logData.split("\n")
								? logData.split("\n").map((line: string, index: number) => {
										return (
											<Typography key={index} variant="caption">
												{line ? JSON.parse(line).result.content : "End"}
											</Typography>
										);
								  })
								: logData}
						</>
					) :
							"Unable to retrieve logs."
				) : null}
			</Drawer>
			{/*	isErrorLog && (
					<ServerError />
				) Remove in case of timeouts, but this hides real errors from the user. */}
		</>
	);
};

export default WorkflowLog;
