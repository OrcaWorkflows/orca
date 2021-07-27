import axios from "axios";
import { NotificationManager } from "react-notifications";

import { Workflow } from "../components/data/interface";
import State from "../components/data/state";
import {
	API,
	API_PATH,
	DIVIDER,
	notificationTimeoutMillis,
	SERVICE_ACCOUNT_NAME,
	WORKFLOW,
} from "../config";

export function submitWorkflow(data: Workflow, onSuccess: any, onError: any) {
	console.log("Submit initiated.");
	axios.create({
		headers: {
			"Content-Type": "application/json",
		},
	});
	axios
		.post(API + API_PATH + WORKFLOW + DIVIDER + "submit", data, {})
		.then(onSuccess)
		.catch(onError);
}

export function resubmitWorkflow(workflowName: string) {
	console.log("Resubmit initiated.");
	axios
		.put(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName +
				"/resubmit",
			{}
		)
		.then((response) => {
			console.log(response.data);
			NotificationManager.success(
				"Successfully Resubmitted Workflow",
				"Success",
				notificationTimeoutMillis
			);
		})
		.catch((error) => {
			console.log(error);
			NotificationManager.error(
				"Resubmit Failed",
				error.toString(),
				notificationTimeoutMillis
			);
		});
}

export function suspendWorkflow(workflowName: string) {
	console.log("Suspend initiated.");
	axios
		.put(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName +
				"/suspend",
			{}
		)
		.then((response) => {
			console.log(response);
			NotificationManager.success(
				"Successfully Suspended Workflow",
				"Success",
				notificationTimeoutMillis
			);
		})
		.catch((error) => {
			console.log(error);
			NotificationManager.error(
				"Suspend Failed",
				error.toString(),
				notificationTimeoutMillis
			);
		});
}

export function resumeWorkflow(workflowName: string) {
	console.log("Resume initiated.");
	axios
		.post(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName +
				"/resume",
			{}
		)
		.then((response) => {
			console.log(response);
			NotificationManager.success(
				"Successfully Resumed Workflow",
				"Success",
				notificationTimeoutMillis
			);
		})
		.catch((error) => {
			console.log(error);
			NotificationManager.error(
				"Resume Failed",
				error.toString(),
				notificationTimeoutMillis
			);
		});
}

export function stopWorkflow(workflowName: string) {
	console.log("Stop initiated.");
	axios
		.put(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName +
				"/stop",
			{}
		)
		.then((response) => {
			console.log(response);
			NotificationManager.success(
				"Successfully Stopped Workflow",
				"Success",
				notificationTimeoutMillis
			);
		})
		.catch((error) => {
			console.log(error);
			NotificationManager.error(
				"Stop Failed",
				error.toString(),
				notificationTimeoutMillis
			);
		});
}

export function terminateWorkflow(workflowName: string) {
	console.log("Terminate initiated.");
	axios
		.put(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName +
				"/terminate",
			{}
		)
		.then((response) => {
			console.log(response);
			NotificationManager.success(
				"Successfully Terminated Workflow",
				"Success",
				notificationTimeoutMillis
			);
		})
		.catch((error) => {
			console.log(error);
			NotificationManager.error(
				"Terminate Failed",
				error.toString(),
				notificationTimeoutMillis
			);
		});
}

export function deleteWorkflow(workflowName: string) {
	console.log("Delete initiated.");
	axios
		.delete(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName,
			{}
		)
		.then((response) => {
			console.log(response);
			NotificationManager.success(
				"Successfully Deleted Workflow",
				"Success",
				notificationTimeoutMillis
			);
		})
		.catch((error) => {
			console.log(error);
			NotificationManager.error(
				"Delete Failed",
				error.toString(),
				notificationTimeoutMillis
			);
		});
}

export function getWorkflowStatus(workflowName: string) {
	axios
		.get(
			API +
				API_PATH +
				WORKFLOW +
				DIVIDER +
				SERVICE_ACCOUNT_NAME +
				DIVIDER +
				workflowName,
			{}
		)
		.then((response) => {
			State.workflowStatus =
				response.data.metadata.labels["workflows.argoproj.io/phase"];
		})
		.catch((error) => {
			console.log(error);
		});
}

export function getAllWorkflows(): Promise<any> {
	return axios
		.get(API + API_PATH + WORKFLOW, {})
		.then((response) => response.data)
		.catch((error) => {
			console.log(error);
		});
}
