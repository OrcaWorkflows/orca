import React from 'react';
import {Workflow} from "../data/interface";
import RequestUtils from "../event/utils";
import State from "../data/state";

const TopBar = () => {
    return (
        <div>
            <button onClick={() => RequestUtils.submit(new class implements Workflow {
                name= "test-";
                tasks = State.tasks;
            })} className="topbarbutton">Submit</button>
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
