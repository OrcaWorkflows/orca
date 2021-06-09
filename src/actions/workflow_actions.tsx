import axios from "axios";
import {API, API_PATH, DIVIDER, notificationTimeoutMillis, SERVICE_ACCOUNT_NAME, WORKFLOW, WORKFLOWS} from "../config";
import {Workflow} from "../components/data/interface";
import State from "../components/data/state";
import {NotificationManager} from "react-notifications";

export function submitWorkflow(data:Workflow, onSuccess:any, onError:any) {
    console.log("Submit initiated.");
    const newAxios=axios.create({
        headers: {
            'Content-Type': 'application/json',
        }
    });
    newAxios.post(API+API_PATH+WORKFLOW+DIVIDER+"submit",data,
        {}).then(onSuccess).catch(onError);
}

export function resubmitWorkflow(workflowName:string) {
    const newAxios=axios.create();
    newAxios.put(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName + "/resubmit",
        {}).then((response) => {
        console.log(response.data);
        NotificationManager.success('Successfully Resubmitted Workflow', 'Success', notificationTimeoutMillis);
    }).catch((error) => {
        console.log(error);
        NotificationManager.error('Resubmit Failed', error.toString(), notificationTimeoutMillis);
    });
}

export function suspendWorkflow(workflowName:string) {
    console.log("Suspend initiated.");
    const newAxios=axios.create()
    newAxios.put(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName + "/suspend",
        {}).then((response) => {
        console.log(response);
        NotificationManager.success('Successfully Suspended Workflow', 'Success', notificationTimeoutMillis);
    }).catch((error) => {
        console.log(error);
        NotificationManager.error('Suspend Failed', error.toString(), notificationTimeoutMillis);
    });
}

export function resumeWorkflow(workflowName:string) {
    console.log("Resume initiated.");
    const newAxios=axios.create()
    newAxios.post(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName +"/resume",
        {}).then((response) => {
        console.log(response);
        NotificationManager.success('Successfully Resumed Workflow', 'Success', notificationTimeoutMillis);
    }).catch((error) => {
        console.log(error);
        NotificationManager.error('Resume Failed', error.toString(), notificationTimeoutMillis);
    });
}

export function stopWorkflow(workflowName:string) {
    console.log("Stop initiated.");
    const newAxios=axios.create()
    newAxios.put(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName +"/stop",
        {}).then((response) => {
        console.log(response);
        NotificationManager.success('Successfully Stopped Workflow', 'Success', notificationTimeoutMillis);
    }).catch((error) => {
        console.log(error);
        NotificationManager.error('Stop Failed', error.toString(), notificationTimeoutMillis);
    });
}

export function terminateWorkflow(workflowName:string) {
    console.log("Terminate initiated.");
    const newAxios=axios.create()
    newAxios.put(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName +"/terminate",
        {}).then((response) => {
        console.log(response);
        NotificationManager.success('Successfully Terminated Workflow', 'Success', notificationTimeoutMillis);
    }).catch((error) => {
        console.log(error);
        NotificationManager.error('Terminate Failed', error.toString(), notificationTimeoutMillis);
    });
}

export function deleteWorkflow(workflowName:string) {
    console.log("Delete initiated.");
    const newAxios=axios.create()
    newAxios.delete(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName,
        {}).then((response) => {
        console.log(response);
        NotificationManager.success('Successfully Deleted Workflow', 'Success', notificationTimeoutMillis);
    }).catch((error) => {
        console.log(error);
        NotificationManager.error('Delete Failed', error.toString(), notificationTimeoutMillis);
    });
}

export function getWorkflowStatus(workflowName:string) {
    const newAxios=axios.create()
    newAxios.get(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + workflowName,
        {}).then((response) => {
        State.workflowStatus = response.data.metadata.labels["workflows.argoproj.io/phase"];
    }).catch((error) => {
        console.log(error);
    });
}

export function getAllWorkflows(): Promise<any> {
    const newAxios=axios.create()
    return newAxios.get(API + API_PATH + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME,
        {}).then((response) => response.data).catch((error) => {
        console.log(error);
    });
}
