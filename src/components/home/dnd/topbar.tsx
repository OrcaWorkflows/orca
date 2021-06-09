import React from 'react';
import {Workflow} from "../../data/interface";
import {createTaskForEdge, monitor} from "../../utils/utils";
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

const TopBar = () => {
    const submit = () => {
        try {
            let edges:Elements = JSON.parse(localStorage.getItem("edges") as string) as Elements;
            for (let key in edges) {
                if (edges.hasOwnProperty(key)){
                    let edge:Edge = (edges[key] as Edge);
                    createTaskForEdge(edge);
                }
            }
            submitWorkflow(new class implements Workflow {
                name= "test-";
                tasks = State.tasks;
            }, (response:AxiosResponse) => {
                console.log(response.data);
                localStorage.setItem("workflowName", response.data.metadata.name)
                State.tasks = [];
                NotificationManager.success('Successfully Submitted Workflow', 'Success', notificationTimeoutMillis);
            }, (error:any) => {
                NotificationManager.error('Submit Failed. Check the server.', "Error", notificationTimeoutMillis);
                State.tasks = [];
                console.log(error);
            });
            monitor();
        }
        catch (e) {
            NotificationManager.error('Submit Failed', "Error", notificationTimeoutMillis);
        }
    };

    return (
        <div className={"parent-top-bar"}>
            <NotificationContainer/>
            <button onClick={submit} className="topbarbutton">Submit</button>
            <button onClick={() => {resubmitWorkflow(localStorage.getItem("workflowName") as string);
                monitor();}} className="topbarbutton">Resubmit</button>
            <button onClick={() => suspendWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Suspend</button>
            <button onClick={() => resumeWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Resume</button>
            <button onClick={() => stopWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Stop</button>
            <button onClick={() => terminateWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Terminate</button>
            <button onClick={() => deleteWorkflow(localStorage.getItem("workflowName") as string)} className="topbarbutton">Delete</button>
        </div>
    );
}

export default TopBar;
