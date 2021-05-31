import delay from "delay";
import State from "../../data/state";

export const timeoutMillis = 2000;

export async function delayNotification() {
    await delay(timeoutMillis);
}

export function findIndex(node_id:string) {
    for (let i = 0; i < State.nodeConfList.length; i++) {
        if (State.nodeConfList[i].id === node_id) {
            return i;
        }
    }
    return -1;
}