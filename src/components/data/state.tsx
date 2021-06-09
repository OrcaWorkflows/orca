import {Task} from "./interface";
import {Elements} from "react-flow-renderer";
import {WorkflowRes} from "../workflows/workflowinterface";


export class NodeConf {
    id:string;

    constructor(id:string) {
        this.id = id;
    }
}

export class S3Conf extends NodeConf {
    bucket_name: string;
    file_path: string;
    file_type: string;

    constructor(id:string, bucket_name:string, file_path:string, file_type:string) {
        super(id);
        this.bucket_name = bucket_name;
        this.file_path = file_path;
        this.file_type = file_type;
    }
}

export class PubSubConf extends NodeConf {
    project_id: string;
    topic: string;
    topic_action: string;
    timeout: number;

    constructor(id:string, project_id:string, topic:string, topic_action:string, timeout:number) {
        super(id);
        this.project_id = project_id;
        this.topic = topic;
        this.topic_action = topic_action;
        this.timeout = timeout;
    }
}

export class KafkaConf extends NodeConf {
    broker_host: string;
    topic_name: string;

    constructor(id:string, broker_host:string, topic_name:string) {
        super(id);
        this.broker_host = broker_host;
        this.topic_name = topic_name;
    }
}

export class ElasticsearchConf extends NodeConf {
    index_name: string;
    host: string;

    constructor(id:string, index_name:string, host:string) {
        super(id);
        this.index_name = index_name;
        this.host = host;
    }
}

export class State {
    static tasks: Array<Task> = [];
    static currentNodeClick: string = "";
    static workflowStatus:string = "";
    static workflows:Array<WorkflowRes>;
}

export default State;
