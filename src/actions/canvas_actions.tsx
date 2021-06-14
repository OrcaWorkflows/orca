import axios from "axios";
import {NotificationManager} from "react-notifications";
import {API, API_PATH, CANVAS, notificationTimeoutMillis} from "../config";
import {Elements} from "react-flow-renderer";

export function getCanvas() : Promise<any> {
    return axios.get(API + API_PATH + CANVAS, )
        .then(response => response.data);
}

export function setCanvas(nodes:Elements, edges:Elements) {
    axios.post(API + API_PATH + CANVAS,
        {
            id: localStorage.getItem("canvasID"),
            property: {nodes: nodes, edges: edges}
        })
        .then(response => {
            console.log("New state of canvas updated.");
        }).catch((error) => {
            NotificationManager.error(error.toString(), 'Could not set canvas.', notificationTimeoutMillis);
        });
}