import { useState, useEffect } from "react";

import { Grid, Divider, Paper, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { ReactFlowProvider } from "react-flow-renderer";
import { useQueryClient } from "react-query";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { useGetFirstWorkflow } from "actions/workflowActions";
import DnDFlow from "views/main/Home/DnDFlow";
import Sidebar from "views/main/Home/Sidebar";
import WorkflowLog from "views/main/Home/WorkflowLog";

const useStyles = makeStyles((theme) => ({
	fullHeight: { height: "100%" },
	root: { height: "calc(100vh - 48px)" },
	sidebar: {
		width: theme.spacing(30),
	},
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
	const location = useLocation();
	const { workflowID } = useParams<HomeParams>();
	const [loggedPodName, setLoggedPodName] = useState<string | undefined>();
	const [openLog, setOpenLog] = useState(false);

	const workflows = useGetFirstWorkflow().data?.workflows;
	const lastCreatedWorkflowID = workflows?.length ? workflows[0].id : undefined;

	const queryClient = useQueryClient();
	useEffect(() => {
		if (
			lastCreatedWorkflowID &&
			!(
				location as {
					pathname: string;
					state: { addNew: boolean } | undefined;
				}
			).state?.addNew
		) {
			if (!workflowID) history.replace(`/home/${lastCreatedWorkflowID}`);
			return () => {
				queryClient.resetQueries(["workflows", 0, 1]);
			};
		}
	}, [lastCreatedWorkflowID, location]);

	return (
		<>
			<Paper className={classes.root}>
				<Grid
					container
					className={classes.fullHeight}
					justifyContent="space-between"
				>
					<OverlayScrollbarsComponent
						options={{
							scrollbars: { autoHide: "leave" },
						}}
					>
						<Grid
							item
							className={clsx(classes.fullHeight, classes.sidebar)}
							xs="auto"
						>
							<Sidebar />
						</Grid>
					</OverlayScrollbarsComponent>
					<Divider flexItem orientation="vertical" />
					<Grid item className={(classes.fullHeight, classes.DnDFlow)} xs>
						<Paper className={classes.fullHeight} variant="outlined">
							<ReactFlowProvider>
								<DnDFlow
									setOpenLog={setOpenLog}
									setLoggedPodName={setLoggedPodName}
								/>
							</ReactFlowProvider>
						</Paper>
					</Grid>
				</Grid>
			</Paper>
			<WorkflowLog
				openLog={openLog}
				setOpenLog={setOpenLog}
				podName={loggedPodName}
			/>
		</>
	);
};

export default Home;
