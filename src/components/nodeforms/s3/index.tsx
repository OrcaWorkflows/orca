import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {delayNotification, timeoutMillis} from "../helper"

const S3Form = forwardRef((props, ref) => {
    const [state, setState] = useState(true);
    const [S3FormValues, setS3FormValues] = useState({});

    const hideS3Form = () => {
        setState(true);
    };

    const showS3Form = () => {
        if (!state)
            setState(true);
        else
            setState(false);
    }

    const getS3FormValues = () => {
        return S3FormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            showS3Form: showS3Form,
            hideS3Form: hideS3Form,
            getFormValues: getS3FormValues
        };
    });

    const initialValues = {
        bucket_name: "",
        file_path: "",
        file_type: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        console.log(JSON.stringify(values, null, 2));
        setS3FormValues(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
        delayNotification().then(() => hideS3Form());
    };

    return (
        <div className={"container"} hidden={state}>
            <NotificationContainer/>
            <label className={"label"}>S3 Configurations</label>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default S3Form;