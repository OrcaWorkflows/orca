import axios from "axios";
import {Task, Workflow} from "../data/interface";
import State, {ElasticsearchConf, KafkaConf, S3Conf} from "../data/state";
import {Edge} from "react-flow-renderer";
import {timeoutMillis} from "../home/nodeforms/helper";
import {NotificationManager} from "react-notifications";
import {SEPERATOR} from "../../index";
import {WorkflowListRes, WorkflowRes} from "../workflows/workflowinterface";


const Read = "Read";
const Write = "Write";

const API=process.env.API || "http://192.168.2.102:5000/";
const WORKFLOWS = "workflows";
const SERVICE_ACCOUNT_NAME = "argo";
const DIVIDER = "/";

function findIndex(node_id:string) {
    for (let i = 0; i < State.nodeConfList.length; i++) {
        if (State.nodeConfList[i].id === node_id) {
            return i;
        }
    }
    return -1;
}

function isConfGiven(nodeName:string):boolean {
    const index = findIndex(nodeName);
    if (nodeName.indexOf("S3") >= 0 && State.nodeConfList[index].hasOwnProperty("bucket_name")) {
        return true;
    }
    else if (nodeName.indexOf("Kafka") >= 0 && State.nodeConfList[index].hasOwnProperty("broker_host")) {
        return true;
    }
    else if (nodeName.indexOf("Elasticsearch") >= 0 && State.nodeConfList[index].hasOwnProperty("host")) {
        return true;
    }
    NotificationManager.error('You have not configured ' + nodeName + ' Node', "Error", timeoutMillis);
    return false;
}

function taskGenerator(edge:Edge, dependencies:Array<string>, type:string) {
    let nodeName = "";
    if (type === "Read") {
        nodeName = edge.source;
    } else if (type === "Write") {
        nodeName = edge.target;
    }
    let task: Task = {
        name: nodeName + SEPERATOR + type,
        dependencies: dependencies,
        templateRef: {
            "name": "orca-operators",
            "template": "orca-operators"
        },
        arguments: {
            parameters: [
                {"name": "OPERATOR", "value": nodeName.toLowerCase().split(SEPERATOR)[0]},
                {"name": "OPERATOR_TYPE", "value": type},
                {"name": "REDIS_URL", "value": State.redisConf.split(":")[0]},
                {"name": "REDIS_PORT", "value": State.redisConf.split(":")[1]},
            ]
        }
    }
    if (type === "Read") {
        task.arguments.parameters.push({"name": "REDIS_PUSH_KEY", "value": "testMult"});
        task.arguments.parameters.push({"name": "REDIS_POP_KEY", "value": "None"});
    } else if (type === "Write") {
        task.arguments.parameters.push({"name": "REDIS_PUSH_KEY", "value": "None"});
        task.arguments.parameters.push({"name": "REDIS_POP_KEY", "value": "testMult"});
    }
    let index = findIndex(nodeName);
    if (nodeName.indexOf("S3") >= 0) {
        task.arguments.parameters.push({
            "name": "AWS_S3_BUCKET_NAME",
            "value": (State.nodeConfList[index] as S3Conf).bucket_name
        });
        task.arguments.parameters.push({
            "name": "AWS_S3_FILE_PATH",
            "value": (State.nodeConfList[index] as S3Conf).file_path
        });
        task.arguments.parameters.push({
            "name": "AWS_S3_FILE_TYPE",
            "value": (State.nodeConfList[index] as S3Conf).file_type
        });
    } else if (nodeName.indexOf("Kafka") >= 0) {
        task.arguments.parameters.push({
            "name": "BOOTSTRAP_SERVERS",
            "value": (State.nodeConfList[index] as KafkaConf).broker_host
        });
        task.arguments.parameters.push({
            "name": "KAFKA_TOPIC",
            "value": (State.nodeConfList[index] as KafkaConf).topic_name
        });
    } else if (nodeName.indexOf("Elasticsearch") >= 0) {
        task.arguments.parameters.push({
            "name": "ELASTICSEARCH_HOST",
            "value": (State.nodeConfList[index] as ElasticsearchConf).host
        });
        task.arguments.parameters.push({
            "name": "ELASTICSEARCH_INDEX",
            "value": (State.nodeConfList[index] as ElasticsearchConf).index_name
        });
    }
    return task;
}


export function createTasksForEdge(edge: Edge) {
    if (! isConfGiven(edge.source)) {
        throw new Error();
    }
    if (! isConfGiven(edge.target)) {
        throw new Error();
    }
    let flag1:boolean = false;
    let flag2:boolean = false;
    for (let key in State.tasks) {
        if (State.tasks.hasOwnProperty(key)){
            let tempTask:Task = (State.tasks[key] as Task);
            if (tempTask.name.split("-")[0] + "-" + tempTask.name.split("-")[1] === edge.target) {
                tempTask.dependencies.push(edge.source + SEPERATOR + Read);
                flag1 = true;
            }
            if (tempTask.name === edge.source + SEPERATOR + Read) {
                flag2 = true;
            }
        }
    }
    const dep = hasDependency(edge.source);
    const dependencies:Array<string> = [];
    if (dep) {
        dependencies.push(edge.source + SEPERATOR + Write);
    }
    if (! flag2) {
        State.tasks.push(taskGenerator(edge, dependencies, Read));
    }
    if (! flag1) {
        State.tasks.push(taskGenerator(edge, [edge.source + SEPERATOR + Read], Write));
    }
}

export function hasDependency(nodeName:string):boolean {
    const edge = State.edges.find(x => (x as Edge).target === nodeName);
    return edge !== undefined;
}

export function monitor_h() {
    let heartbeats = require('heartbeats');
    let heart = heartbeats.createHeart(1000);
    heart.createEvent(1, function(){
        let status:string = "";
        RequestUtils.getStatus();
        if (status !== State.workflowStatus) {
            status = State.workflowStatus;
            if (status === "Failed") {
                NotificationManager.error(status, "Status", timeoutMillis);
                heart.kill();
            }
            else {
                NotificationManager.success(status, "Status", timeoutMillis);
                heart.kill();
            }
        }
    });
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function monitor() {
    console.log("Monitor initiated.");
    let status:string = "";
    while (status !== "Succeeded") {
        await delay(1000);
        RequestUtils.getStatus();
        if (status !== State.workflowStatus) {
            status = State.workflowStatus;
            if (status === "Failed") {
                NotificationManager.error(status, "Status", timeoutMillis);
                break;
            }
            else {
                NotificationManager.success(status, "Status", timeoutMillis);
            }

        }
    }
    console.log("Monitor finished.");
}

export default class RequestUtils {
    static submit(data:Workflow, onSuccess:any, onError:any) {
        console.log("Submit initiated.");
        const newAxios=axios.create({
            headers: {
                'Content-Type': 'application/json',
            }
        });
        newAxios.post(API+"submit",data,
            {}).then(onSuccess).catch(onError);
    }

    static resubmit() {
        const newAxios=axios.create();
        newAxios.put(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName + "/resubmit",
            {}).then((response) => {
                console.log(response.data);
            NotificationManager.success('Successfully Resubmitted Workflow', 'Success', timeoutMillis);
            }).catch((error) => {
            console.log(error);
            NotificationManager.error('Resubmit Failed', error.toString(), timeoutMillis);
        });
    }

    static suspend() {
        console.log("Suspend initiated.");
        const newAxios=axios.create()
        newAxios.put(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName + "/suspend",
            {}).then((response) => {
                console.log(response);
                NotificationManager.success('Successfully Suspended Workflow', 'Success', timeoutMillis);
            }).catch((error) => {
                console.log(error);
                NotificationManager.error('Suspend Failed', error.toString(), timeoutMillis);
            });
    }

    static resume() {
        console.log("Resume initiated.");
        const newAxios=axios.create()
        newAxios.post(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName +"/resume",
            {}).then((response) => {
                console.log(response);
                NotificationManager.success('Successfully Resumed Workflow', 'Success', timeoutMillis);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error('Resume Failed', error.toString(), timeoutMillis);
        });
    }

    static stop() {
        console.log("Stop initiated.");
        const newAxios=axios.create()
        newAxios.put(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName +"/stop",
            {}).then((response) => {
                console.log(response);
                NotificationManager.success('Successfully Stopped Workflow', 'Success', timeoutMillis);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error('Stop Failed', error.toString(), timeoutMillis);
        });
    }

    static terminate() {
        console.log("Terminate initiated.");
        const newAxios=axios.create()
        newAxios.put(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName +"/terminate",
            {}).then((response) => {
                console.log(response);
                NotificationManager.success('Successfully Terminated Workflow', 'Success', timeoutMillis);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error('Terminate Failed', error.toString(), timeoutMillis);
        });
    }

    static delete() {
        console.log("Delete initiated.");
        const newAxios=axios.create()
        newAxios.delete(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName,
            {}).then((response) => {
                console.log(response);
                NotificationManager.success('Successfully Deleted Workflow', 'Success', timeoutMillis);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error('Delete Failed', error.toString(), timeoutMillis);
        });
    }

    static getStatus() {
        const newAxios=axios.create()
        newAxios.get(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME + DIVIDER + State.workflowName,
            {}).then((response) => {
                State.workflowStatus = response.data.metadata.labels["workflows.argoproj.io/phase"];
        }).catch((error) => {
            console.log(error);
        });
    }

    static getAllWorkflows(): Promise<any> {
        const newAxios=axios.create()
        return newAxios.get(API + WORKFLOWS + DIVIDER + SERVICE_ACCOUNT_NAME,
            {}).then((response) => response.data).catch((error) => {
            console.log(error);
        });
    }
}
