import {Task} from "./interface";
import {Elements} from "react-flow-renderer";

class State {
    static tasks: Array<Task> = [];
    static edges: Elements = [];
    static nodes: Elements = [];
    static workflowName: string = "";
    static configS3: any;
    static configKafka: any;
    static configES: any;
}

export default State;
