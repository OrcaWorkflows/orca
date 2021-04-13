import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {NotificationContainer, NotificationManager} from "react-notifications";

const DefaultForm = forwardRef((props, ref) => {
    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>Have not been implemented yet.</label>
        </div>)
});

export default DefaultForm;