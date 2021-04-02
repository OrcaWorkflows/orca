import React from 'react';

import RequestUtils from "../event/utils";

const TopBar = () => {
    return (
        <div>
            <button onClick={() => RequestUtils.submit("formData")} className="topbarbutton">Submit</button>
            <button onClick={() => RequestUtils.resubmit("formData")} className="topbarbutton">Resubmit</button>
            <button onClick={() => RequestUtils.suspend("formData")} className="topbarbutton">Suspend</button>
            <button onClick={() => RequestUtils.resume("formData")} className="topbarbutton">Resume</button>
            <button onClick={() => RequestUtils.stop("formData")} className="topbarbutton">Stop</button>
            <button onClick={() => RequestUtils.terminate("formData")} className="topbarbutton">Terminate</button>
            <button onClick={() => RequestUtils.delete("formData")} className="topbarbutton">Delete</button>
        </div>

    );
}

export default TopBar;
