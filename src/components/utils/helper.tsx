import {Elements} from "react-flow-renderer/dist/types";

export function findIndex(node_id:string, nodes:Elements) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === node_id) {
            return i;
        }
    }
    return -1;
}