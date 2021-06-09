import {Task} from "../data/interface";
import State, {ElasticsearchConf, KafkaConf, NodeConf, PubSubConf, S3Conf} from "../data/state";
import {Edge} from "react-flow-renderer";
import {NotificationManager} from "react-notifications";
import {SEPARATOR} from "../../index";
import {notificationTimeoutMillis} from "../../config";
import {getWorkflowStatus} from "../../actions/workflow_actions";
import {findIndex} from "./helper";


function isConfGiven(nodeName:string, nodeConfList:Array<NodeConf>):boolean {
    const index = findIndex(nodeName);
    if (nodeName.indexOf("S3") >= 0 && nodeConfList[index].hasOwnProperty("bucket_name")) {
        return true;
    }
    else if (nodeName.indexOf("Kafka") >= 0 && nodeConfList[index].hasOwnProperty("broker_host")) {
        return true;
    }
    else if (nodeName.indexOf("Elasticsearch") >= 0 && nodeConfList[index].hasOwnProperty("host")) {
        return true;
    }
    else if (nodeName.indexOf("PubSub") >= 0 && nodeConfList[index].hasOwnProperty("topic")) {
        return true;
    }
    NotificationManager.error('You have not configured ' + nodeName + ' Node', "Error", notificationTimeoutMillis);
    return false;
}

function appendRequiredVariables(task: Task, name: string, index: number, nodeConfList:Array<NodeConf>) {
    if (name.indexOf("S3") >= 0) {
        task.arguments.parameters.push({
            "name": "AWS_S3_BUCKET_NAME",
            "value": (nodeConfList[index] as S3Conf).bucket_name
        });
        task.arguments.parameters.push({
            "name": "AWS_S3_FILE_PATH",
            "value": (nodeConfList[index] as S3Conf).file_path
        });
        task.arguments.parameters.push({
            "name": "AWS_S3_FILE_TYPE",
            "value": (nodeConfList[index] as S3Conf).file_type
        });
    } else if (name.indexOf("Kafka") >= 0) {
        task.arguments.parameters.push({
            "name": "BOOTSTRAP_SERVERS",
            "value": (nodeConfList[index] as KafkaConf).broker_host
        });
        task.arguments.parameters.push({
            "name": "KAFKA_TOPIC",
            "value": (nodeConfList[index] as KafkaConf).topic_name
        });
    } else if (name.indexOf("Elasticsearch") >= 0) {
        task.arguments.parameters.push({
            "name": "ELASTICSEARCH_HOST",
            "value": (nodeConfList[index] as ElasticsearchConf).host
        });
        task.arguments.parameters.push({
            "name": "ELASTICSEARCH_INDEX",
            "value": (nodeConfList[index] as ElasticsearchConf).index_name
        });
    } else if (name.indexOf("PubSub") >= 0) {
        task.arguments.parameters.push({
            "name": "GOOGLE_PROJECT_ID",
            "value": (nodeConfList[index] as PubSubConf).project_id
        });
        task.arguments.parameters.push({
            "name": "GOOGLE_PUBSUB_TOPIC",
            "value": (nodeConfList[index] as PubSubConf).topic
        });
        task.arguments.parameters.push({
            "name": "GOOGLE_PUBSUB_TOPIC_ACTION",
            "value": (nodeConfList[index] as PubSubConf).topic_action
        });
        task.arguments.parameters.push({
            "name": "GOOGLE_PUBSUB_TIMEOUT",
            "value": (nodeConfList[index] as PubSubConf).timeout.toString()
        });
    }
}

function taskGenerator(edge:Edge, dependencies:Array<string>, nodeConfList:Array<NodeConf>) {
    let nodeName = edge.source + SEPARATOR + edge.target;
    let task: Task = {
        name: nodeName,
        dependencies: dependencies,
        templateRef: {
            "name": "orca-operators",
            "template": "orca-operators"
        },
        arguments: {
            parameters: [
                {"name": "OPERATOR_SOURCE", "value": edge.source.toLowerCase().split(SEPARATOR)[0]},
                {"name": "OPERATOR_TARGET", "value": edge.target.toLowerCase().split(SEPARATOR)[0]}
            ]
        }
    }
    let sourceIndex = findIndex(edge.source);
    let targetIndex = findIndex(edge.target);

    appendRequiredVariables(task, edge.source, sourceIndex, nodeConfList);
    appendRequiredVariables(task, edge.target, targetIndex, nodeConfList);
    console.log(task);
    return task;
}


export function createTaskForEdge(edge: Edge) {
    let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
    if (! isConfGiven(edge.source, nodeConfList)) {
        throw new Error();
    }
    if (! isConfGiven(edge.target, nodeConfList)) {
        throw new Error();
    }
    const dependencies:Array<string> = [];
    State.tasks.forEach(
        (task) => {
            if (edge.source === task.name.split("-")[2] + SEPARATOR + task.name.split("-")[3]) {
                dependencies.push(task.name);
            }
        }
    )
    State.tasks.push(taskGenerator(edge, dependencies, nodeConfList));
    console.log(State.tasks);
}

export function monitor_h() {
    let heartbeats = require('heartbeats');
    let heart = heartbeats.createHeart(1000);
    heart.createEvent(1, function(){
        let status:string = "";
        getWorkflowStatus(localStorage.getItem("workflowName") as string);
        if (status !== State.workflowStatus) {
            status = State.workflowStatus;
            if (status === "Failed") {
                NotificationManager.error(status, "Status", notificationTimeoutMillis);
                heart.kill();
            }
            else {
                NotificationManager.success(status, "Status", notificationTimeoutMillis);
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
    /*let status:string = "";
    while (status !== "Succeeded") {
        await delay(1000);
        getWorkflowStatus(State.workflowName);
        if (status !== State.workflowStatus) {
            status = State.workflowStatus;
            if (status === "Failed") {
                NotificationManager.error(status, "Status", notificationTimeoutMillis);
                break;
            }
            else {
                NotificationManager.success(status, "Status", notificationTimeoutMillis);
            }

        }
    }*/
    console.log("Monitor finished.");
}
