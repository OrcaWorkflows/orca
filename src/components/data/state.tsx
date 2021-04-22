import {Task} from "./interface";
import {Elements} from "react-flow-renderer";
import {Workflows} from "../workflows/workflowinterface";


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
    static edges: Elements = [];
    static nodes: Elements = [];
    static nodeConfList: Array<NodeConf> = [];
    static workflowName: string = "";
    static currentNodeClick: string = "";
    static redisConf:string = "192.168.2.101:6379";
    static workflowStatus:string = "";
    static workflows:Workflows;
}

export default State;
