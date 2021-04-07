import {Task} from "./interface";

class State {
    static tasks: Array<Task> = [];
    static workflowName: string = "";
    static configS3: any;
    static configKafka: any;
    static configES: any;
}

export default State;
