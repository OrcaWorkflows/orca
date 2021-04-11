import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {timeoutMillis} from "../helper"
import State from "../../data/state";

const S3Form = forwardRef((props, ref) => {
    const [S3FormValues, setS3FormValues] = useState({});

    const getS3FormValues = () => {
        return S3FormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getS3FormValues
        };
    });

    const initialValues = {
        bucket_name: "",
        file_path: "",
        file_type: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        setS3FormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.configS3 = JSON.parse(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>S3 Configurations</label>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    render={DisplayForm}
                />
        </div>)
});

export default S3Form;