import { useState, useEffect } from "react";

import { Grid, Paper, makeStyles } from "@material-ui/core";
import { ReactFlowProvider } from "react-flow-renderer";
import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";

import { Me } from "actions/auth/useUserMe";
import DnDFlow from "views/main/Home/DnDFlow";
import Sidebar from "views/main/Home/Sidebar";
import useLastWorkflowID from "views/main/Home/useLastWorkflowId";
import WorkflowLog from "views/main/Home/WorkflowLog";

const useStyles = makeStyles(() => ({
	fullHeight: { height: "100%" },
	root: { height: "calc(100vh - 48px)" },
	DnDFlow: {
		margin: 20,
	},
}));

export type HomeParams = {
	workflowID: string;
};

const Home = (): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();
	const { workflowID } = useParams<HomeParams>();

	const [selectedEdgeCustomID, setSelectedEdgeCustomID] = useState("");
	const [loggedPodName, setLoggedPodName] = useState<string | undefined>();
	const [openLog, setOpenLog] = useState(false);

	const queryClient = useQueryClient();
	const userMe = queryClient.getQueryData<Me>("me");
	useEffect(() => {
		if (workflowID && userMe)
			localStorage.setItem(
				userMe.username + "-" + "lastVisitedWorkflowID",
				workflowID
			);
	}, [workflowID, userMe]);

	const lastWorkflowID = useLastWorkflowID(userMe?.username);
	useEffect(() => {
		if (!workflowID && lastWorkflowID)
			history.replace(`/home/${lastWorkflowID}`);
	}, [lastWorkflowID]);

	return (
		<>
			<Paper className={classes.root}>
				<Grid
					container
					className={classes.fullHeight}
					justifyContent="space-between"
				>
					<Grid item className={classes.fullHeight} xs="auto">
						<Sidebar />
					</Grid>
					<Grid item className={(classes.fullHeight, classes.DnDFlow)} xs>
						<Paper className={classes.fullHeight} variant="outlined">
							<ReactFlowProvider>
								<DnDFlow
									selectedEdgeCustomID={selectedEdgeCustomID}
									setSelectedEdgeCustomID={setSelectedEdgeCustomID}
									setOpenLog={setOpenLog}
									setLoggedPodName={setLoggedPodName}
								/>
							</ReactFlowProvider>
						</Paper>
					</Grid>
				</Grid>
			</Paper>
			<WorkflowLog
				selectedEdgeCustomID={selectedEdgeCustomID}
				openLog={openLog}
				setOpenLog={setOpenLog}
				podName={loggedPodName}
			/>
		</>
	);
};

export default Home;
