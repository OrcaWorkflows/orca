import axios from "axios";
import {Workflow} from "../data/interface";
import State from "../data/state";

const API=process.env.API || "http://localhost:5000/";
const WORKFLOWS = "workflows/";
const SERVICE_ACCOUNT_NAME = "argo/";

export default class RequestUtils {
    static submit(data:Workflow) {
        console.log("Submit initiated.");
        console.log(data);
        const newAxios=axios.create({
            headers: {
                'Content-Type': 'application/json',
            }
        });
        newAxios.post(API+"submit",data,
            {}).then((response) => State.workflowName = response.data.metadata.name).catch((error) => console.log(error));
    }

    static resubmit() {
        const newAxios=axios.create();
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName + "/resubmit",
            {}).then((response) => console.log(response.data)).catch((error) => console.log(error));
    }

    static suspend() {
        console.log("Suspend initiated.");
        const newAxios=axios.create()
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName + "/suspend",
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static resume() {
        console.log("Resume initiated.");
        const newAxios=axios.create()
        newAxios.post(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName +"/resume",
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static stop() {
        console.log("Stop initiated.");
        const newAxios=axios.create()
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName +"/stop",
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static terminate() {
        console.log("Terminate initiated.");
        const newAxios=axios.create()
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName +"/terminate",
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static delete() {
        console.log("Delete initiated.");
        const newAxios=axios.create()
        newAxios.delete(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }
}
