import axios from "axios";
import {Task, Workflow} from "../data/interface";
import State from "../data/state";
import {Edge, Elements} from "react-flow-renderer";

const Read = "Read";
const Write = "Write";

const API=process.env.API || "http://localhost:5000/";
const WORKFLOWS = "workflows/";
const SERVICE_ACCOUNT_NAME = "argo/";

export function createTasksForEdge(edge: Edge) : void {
    const dep = hasDependency(edge.source);
    const dependencies:Array<string> = [];
    if (dep) {
        dependencies.push(edge.source + Write);
    }
    let task : Task = {
        name: edge.source + Read,
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
                {"name": "AWS_S3_BUCKET_NAME", "value": State.configS3["bucket_name"]},
                {"name": "AWS_S3_FILE_PATH", "value": State.configS3["file_path"]},
                {"name": "AWS_S3_FILE_TYPE", "value": State.configS3["file_type"]},
                {"name": "BOOTSTRAP_SERVERS", "value": State.configKafka["broker_host"]},
                {"name": "KAFKA_TOPIC", "value": State.configKafka["topic_name"]},
                {"name": "ELASTICSEARCH_HOST", "value": State.configES["host"]},
                {"name": "ELASTICSEARCH_INDEX", "value": State.configES["index_name"]}]
        }
    }
    State.tasks.push(task);
    task = {
        name: edge.target + Write,
        dependencies: [edge.source + Read],
        templateRef: {
            "name": "orca-operators",
            "template": "orca-operators"
        },
        arguments: {
            parameters: [{"name": "OPERATOR", "value": edge.target.toLowerCase()},
                {"name": "OPERATOR_TYPE", "value": "read"},
                {"name": "REDIS_URL", "value": "192.168.2.101"},
                {"name": "REDIS_PORT", "value": "6379"},
                {"name": "REDIS_PUSH_KEY", "value": "testFinal"},
                {"name": "REDIS_POP_KEY", "value": "None"},
                {"name": "AWS_S3_BUCKET_NAME", "value": State.configS3["bucket_name"]},
                {"name": "AWS_S3_FILE_PATH", "value": State.configS3["file_path"]},
                {"name": "AWS_S3_FILE_TYPE", "value": State.configS3["file_type"]},
                {"name": "BOOTSTRAP_SERVERS", "value": State.configKafka["broker_host"]},
                {"name": "KAFKA_TOPIC", "value": State.configKafka["topic_name"]},
                {"name": "ELASTICSEARCH_HOST", "value": State.configES["host"]},
                {"name": "ELASTICSEARCH_INDEX", "value": State.configES["index_name"]}]
        }
    }
    State.tasks.push(task);
    console.log(State.tasks);
}

export function hasDependency(nodeName:string):boolean {
    const edge = State.edges.find(x => (x as Edge).target === nodeName);
    return edge !== undefined;
}

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
            {}).then((response) => {
                State.workflowName = response.data.metadata.name;
                State.tasks = [];
        }, ).catch((error) => console.log(error));
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
