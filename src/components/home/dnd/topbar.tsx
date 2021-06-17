import React from 'react';
import {Workflow} from "../../data/interface";
import {createTaskForEdge} from "../../utils/utils";
import State from "../../data/state";
import {Edge, Elements} from "react-flow-renderer";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {AxiosResponse} from "axios";
import {notificationTimeoutMillis} from "../../../config";
import {
    deleteWorkflow,
    resubmitWorkflow,
    resumeWorkflow,
    stopWorkflow,
    submitWorkflow,
    suspendWorkflow, terminateWorkflow
} from "../../../actions/workflow_actions";

const TopBar = (props : {nodes:Elements, edges:Elements}) => {
    const submit = () => {
        try {
            for (let key in props.edges) {
                if (props.edges.hasOwnProperty(key)){
                    let edge:Edge = (props.edges[key] as Edge);
                    createTaskForEdge(props.nodes, props.edges, edge);
                }
            }
            submitWorkflow(new class implements Workflow {
                name= "test-";
                tasks = State.tasks;
                canvasID = localStorage.getItem("canvasID");
            }, (response:AxiosResponse) => {
                localStorage.setItem("workflowName", response.data.metadata.name)
                State.tasks = [];
                NotificationManager.success('Successfully Submitted Workflow', 'Success', notificationTimeoutMillis);
            }, (error:any) => {
                console.log("Submit failed, " + error.toString());
                NotificationManager.error('Submit Failed. Check the server.', "Error", notificationTimeoutMillis);
                State.tasks = [];
            });
        }
        catch (e) {
            NotificationManager.error('Submit Failed', "Error", notificationTimeoutMillis);
        }
    };

    return (
        <div className={"parent-top-bar"}>
            <NotificationContainer/>
            <button onClick={submit} className="topbarbutton">Submit</button>
            <button onClick={() => resubmitWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Resubmit</button>
            <button onClick={() => suspendWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Suspend</button>
            <button onClick={() => resumeWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Resume</button>
            <button onClick={() => stopWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Stop</button>
            <button onClick={() => terminateWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Terminate</button>
            <button onClick={() => deleteWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Delete</button>
        </div>
    );
}

export default TopBar;
