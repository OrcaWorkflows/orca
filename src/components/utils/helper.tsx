import {NodeConf} from "../data/state";

export function findIndex(node_id:string) {
    let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
    for (let i = 0; i < nodeConfList.length; i++) {
        if (nodeConfList[i].id === node_id) {
            return i;
        }
    }
    return -1;
}