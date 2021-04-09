import axios from "axios";
import {Task, Workflow} from "../data/interface";
import State from "../data/state";
import {Edge, Elements} from "react-flow-renderer";
import {timeoutMillis} from "../nodeforms/helper";
import {NotificationManager} from "react-notifications";



const Read = "Read";
const Write = "Write";

const API=process.env.API || "http://localhost:5000/";
const WORKFLOWS = "workflows/";
const SERVICE_ACCOUNT_NAME = "argo/";

function isConfGiven(nodeName:string):boolean {
    switch(nodeName) {
        case "S3": {
            if (State.configS3 === undefined) {
                NotificationManager.error('You have not configured ' + nodeName + ' Node', "Error", timeoutMillis);
                return false;
            }
            break;
        }
        case "Kafka": {
            if (State.configS3 === undefined) {
                NotificationManager.error('You have not configured ' + nodeName + ' Node', "Error", timeoutMillis);
                return false;
            }
            break;
        }
        case "Elasticsearch": {
            if (State.configS3 === undefined) {
                NotificationManager.error('You have not configured ' + nodeName + ' Node', "Error", timeoutMillis);
                return false;
            }
            break;
        }
    }
    return true;
}

function taskGenerator(edge:Edge, dependencies:Array<string>, type:string) {
    let nodeName = "";
    if (type === "Read") {
        nodeName = edge.source;
    }
    else if (type === "Write") {
        nodeName = edge.target;
    }
    let task:Task = {
        name: nodeName + type,
        dependencies: dependencies,
        templateRef: {
            "name": "orca-operators",
            "template": "orca-operators"
        },
        arguments: {
            parameters: [{"name": "OPERATOR", "value": edge.source.toLowerCase()},
                {"name": "OPERATOR_TYPE", "value": "read"},
                {"name": "REDIS_URL", "value": "192.168.2.101"},
                {"name": "REDIS_PORT", "value": "6379"},
                {"name": "REDIS_PUSH_KEY", "value": "testFinal"},
                {"name": "REDIS_POP_KEY", "value": "None"},
                ]
        }
    }
    if (nodeName === "S3") {
        task.arguments.parameters.push({"name": "AWS_S3_BUCKET_NAME", "value": State.configS3["bucket_name"]});
        task.arguments.parameters.push({"name": "AWS_S3_FILE_PATH", "value": State.configS3["file_path"]});
        task.arguments.parameters.push({"name": "AWS_S3_FILE_TYPE", "value": State.configS3["file_type"]});
    }
    else if (nodeName === "Kafka") {
        task.arguments.parameters.push({"name": "BOOTSTRAP_SERVERS", "value": State.configKafka["broker_host"]});
        task.arguments.parameters.push({"name": "KAFKA_TOPIC", "value": State.configKafka["topic_name"]});
    }
    else if (nodeName === "Elasticsearch") {
        task.arguments.parameters.push({"name": "ELASTICSEARCH_HOST", "value": State.configES["host"]});
        task.arguments.parameters.push({"name": "ELASTICSEARCH_INDEX", "value": State.configES["index_name"]});
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
    const dep = hasDependency(edge.source);
    const dependencies:Array<string> = [];
    if (dep) {
        dependencies.push(edge.source + Write);
    }
    State.tasks.push(taskGenerator(edge, dependencies, Read));
    State.tasks.push(taskGenerator(edge, [edge.source + Read], Write));
    console.log(State.tasks);
}

export function hasDependency(nodeName:string):boolean {
    const edge = State.edges.find(x => (x as Edge).target === nodeName);
    return edge !== undefined;
}

export default class RequestUtils {
    static submit(data:Workflow, onSuccess:any, onError:any) {
        console.log("Submit initiated.");
        console.log(data);
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
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName + "/resubmit",
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
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName + "/suspend",
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
        newAxios.post(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName +"/resume",
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
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName +"/stop",
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
        newAxios.put(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName +"/terminate",
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
        newAxios.delete(API + WORKFLOWS + SERVICE_ACCOUNT_NAME + State.workflowName,
            {}).then((response) => {
                console.log(response);
                NotificationManager.success('Successfully Deleted Workflow', 'Success', timeoutMillis);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error('Delete Failed', error.toString(), timeoutMillis);
        });
    }
}
