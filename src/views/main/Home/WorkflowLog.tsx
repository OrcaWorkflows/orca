import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, makeStyles } from "@material-ui/core";
import { useQueryClient } from "react-query";
import { useParams } from "react-router";

import { useLogOfPod } from "actions/workflowActions";
import { ServerError } from "components";
import { IWorkflow } from "interfaces";
import { HomeParams } from "views/main/Home";

const useStyles = makeStyles((theme) => ({
	log: {
		color: theme.palette.warning.main,
		padding: theme.spacing(2),
		width: "30%",
	},
}));

const WorkflowLog = ({
	podName,
	setLoggedPodName,
}: {
	podName: string;
	setLoggedPodName: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
	const classes = useStyles();
	const { workflowID } = useParams<HomeParams>();

	const queryClient = useQueryClient();
	const currentWorkflow = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	]);
	const argoWorkflowName = currentWorkflow?.argoWorkflowName ?? "";

	const { isError: isErrorLog, data: logData } = useLogOfPod(
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
				open={!!logData}
				onClose={() => {
					setLoggedPodName("");
				}}
			>
				{logData?.split("\n").map((line: string, index: number) => {
					return (
						<Typography key={index} variant="caption">
							{line ? JSON.parse(line).result.content : "End"}
						</Typography>
					);
				})}
			</Drawer>
			{isErrorLog && <ServerError />}
		</>
	);
};

export default WorkflowLog;
