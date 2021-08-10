import { Button, Divider, Grid, makeStyles } from "@material-ui/core";
import { AxiosResponse } from "axios";
import { Edge, Elements } from "react-flow-renderer";
import { NotificationManager } from "react-notifications";

import {
	deleteWorkflow,
	resubmitWorkflow,
	resumeWorkflow,
	stopWorkflow,
	submitWorkflow,
	suspendWorkflow,
	terminateWorkflow,
} from "../../../../actions/workflow_actions";
import { notificationTimeoutMillis } from "../../../../config";
import { createTaskForEdge } from "../../../../utils/utils";
import { Workflow } from "../../../data/interface";
import State from "../../../data/state";

const useStyles = makeStyles((theme) => ({
	button: {
		border: `2px solid ${theme.palette.secondary.dark}`,
		fontWeight: "bold",
		textTransform: "none",
	},
}));

const TopBar = (props: { nodes: Elements; edges: Elements }): JSX.Element => {
	const classes = useStyles();
	const submit = () => {
		try {
			for (const key in props.edges) {
				if (Object.prototype.hasOwnProperty.call(props.edges, key)) {
					const edge: Edge = props.edges[key] as Edge;
					createTaskForEdge(props.nodes, props.edges, edge);
				}
			}
			submitWorkflow(
				new (class implements Workflow {
					name = "test-";
					tasks = State.tasks;
					canvasID = localStorage.getItem("canvasID");
				})(),
				(response: AxiosResponse) => {
					localStorage.setItem("workflowName", response.data.metadata.name);
					State.tasks = [];
					// NotificationManager.success(
					// "Successfully Submitted Workflow",
					// "Success",
					// notificationTimeoutMillis
					// );
				},
				(error: any) => {
					console.log("Submit failed, " + error.toString());
					// NotificationManager.error(
					// 	"Submit Failed. Check the server.",
					// 	"Error",
					// 	notificationTimeoutMillis
					// );
					State.tasks = [];
				}
			);
		} catch (e) {
			NotificationManager.error(
				"Submit Failed",
				"Error",
				notificationTimeoutMillis
			);
		}
	};

	return (
		<>
			<Grid container justifyContent="space-evenly">
				<Button className={classes.button} onClick={submit} variant="contained">
					Submit
				</Button>
				<Button
					className={classes.button}
					onClick={() =>
						resubmitWorkflow(localStorage.getItem("workflowName") as string)
					}
					variant="contained"
				>
					Resubmit
				</Button>
				<Button
					className={classes.button}
					onClick={() =>
						suspendWorkflow(localStorage.getItem("workflowName") as string)
					}
					variant="contained"
				>
					Suspend
				</Button>
				<Button
					className={classes.button}
					onClick={() =>
						resumeWorkflow(localStorage.getItem("workflowName") as string)
					}
					variant="contained"
				>
					Resume
				</Button>
				<Button
					className={classes.button}
					onClick={() =>
						stopWorkflow(localStorage.getItem("workflowName") as string)
					}
					variant="contained"
				>
					Stop
				</Button>
				<Button
					className={classes.button}
					onClick={() =>
						terminateWorkflow(localStorage.getItem("workflowName") as string)
					}
					variant="contained"
				>
					Terminate
				</Button>
				<Button
					className={classes.button}
					onClick={() =>
						deleteWorkflow(localStorage.getItem("workflowName") as string)
					}
					variant="contained"
				>
					Delete
				</Button>
			</Grid>
			<Divider />
		</>
	);
};

export default TopBar;
