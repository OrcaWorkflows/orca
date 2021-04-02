import React from 'react';

import SubmitRequestUtils from "../event/utils";

const TopBar = () => {
    return (
        <div>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Submit</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Retry</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Resubmit</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Suspend</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Resume</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Stop</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Terminate</button>
            <button onClick={() => SubmitRequestUtils.submit("formData")} className="topbarbutton">Delete</button>
        </div>

    );
}

export default TopBar;
