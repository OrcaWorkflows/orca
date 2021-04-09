import React from 'react';
import {Workflow} from "../data/interface";
import RequestUtils, {createTasksForEdge} from "../event/utils";
import State from "../data/state";
import {Edge} from "react-flow-renderer";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {timeoutMillis} from "../nodeforms/helper";
import {AxiosResponse} from "axios";

const TopBar = () => {
    const submit = () => {
        try {
            for (let key in State.edges) {
                let edge:Edge = (State.edges[key] as Edge);
                createTasksForEdge(edge);
            }
            RequestUtils.submit(new class implements Workflow {
                name= "test-";
                tasks = State.tasks;
            }, (response:AxiosResponse) => {
                State.workflowName = response.data.metadata.name;
                State.tasks = [];
                NotificationManager.success('Successfully Submitted Workflow', 'Success', timeoutMillis);
            }, (error:any) => {
                NotificationManager.error('Submit Failed. Check the server.', "Error", timeoutMillis);
                State.tasks = [];
                console.log(error);
            });
        }
        catch (e) {
            NotificationManager.error('Submit Failed', "Error", timeoutMillis);
        }
    };

    return (
        <div>
            <NotificationContainer/>
            <button onClick={submit} className="topbarbutton">Submit</button>
            <button onClick={() => RequestUtils.resubmit()} className="topbarbutton">Resubmit</button>
            <button onClick={() => RequestUtils.suspend()} className="topbarbutton">Suspend</button>
            <button onClick={() => RequestUtils.resume()} className="topbarbutton">Resume</button>
            <button onClick={() => RequestUtils.stop()} className="topbarbutton">Stop</button>
            <button onClick={() => RequestUtils.terminate()} className="topbarbutton">Terminate</button>
            <button onClick={() => RequestUtils.delete()} className="topbarbutton">Delete</button>
        </div>

    );
}

export default TopBar;
