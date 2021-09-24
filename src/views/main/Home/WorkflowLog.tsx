import { Dispatch, SetStateAction } from "react";

import {
	Box,
	CircularProgress,
	Drawer,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { useQueryClient } from "react-query";
import { useParams } from "react-router";

import { useLogOfPod } from "actions/workflowActions";
// import { ServerError } from "components";
import { IWorkflow } from "interfaces";
import { HomeParams } from "views/main/Home";

const useStyles = makeStyles((theme) => ({
	border: { margin: "auto", opacity: 0.5 },
	log: {
		color: theme.palette.warning.main,
		padding: theme.spacing(2),
		width: "30%",
	},
	nolog: {
		fontWeight: theme.typography.fontWeightBold,
		padding: 5,
	},
}));

const WorkflowLog = ({
	openLog,
	setOpenLog,
	podName,
}: {
	openLog: boolean;
	setOpenLog: Dispatch<SetStateAction<boolean>>;
	podName: string | undefined;
}): JSX.Element => {
	const classes = useStyles();
	const { workflowID } = useParams<HomeParams>();

	const queryClient = useQueryClient();
	const currentWorkflow = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	]);
	const argoWorkflowName = currentWorkflow?.argoWorkflowName ?? "";

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

	return (
		<>
			<Drawer
				PaperProps={{ className: classes.log }}
				anchor="right"
				open={openLog}
				onClose={() => {
					setOpenLog(false);
				}}
			>
				{podName ? (
					isLoadingLog ? (
						<Box m="auto">
							<CircularProgress />
						</Box>
					) : logData ? (
						logData.split("\n").map((line: string, index: number) => {
							return (
								<Typography key={index} variant="caption">
									{line ? JSON.parse(line).result.content : "End"}
								</Typography>
							);
						})
					) : (
						<Box
							className={classes.border}
							border={1}
							borderColor="warning.light"
							borderRadius="borderRadius"
						>
							<Typography className={classes.nolog} align="center">
								Execution is omitted since it&apos;s halted before reaching to
								this point.
							</Typography>
						</Box>
					)
				) : (
					<Box
						className={classes.border}
						border={1}
						borderColor="warning.light"
						borderRadius="borderRadius"
					>
						<Typography className={classes.nolog} align="center">
							No pod is created for the selected edge yet.
						</Typography>
					</Box>
				)}
			</Drawer>
			{/*	isErrorLog && (
					<ServerError />
				) Remove in case of timeouts, but this hides real errors from the user. */}
		</>
	);
};

export default WorkflowLog;
