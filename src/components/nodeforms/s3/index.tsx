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

    const setInitialValues = () => {
        if (State.configS3 !== undefined) {
            initialValues.bucket_name = State.configS3["bucket_name"];
            initialValues.file_path = State.configS3["file_path"];
            initialValues.file_type = State.configS3["file_type"];
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setS3FormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.configS3 = JSON.parse(JSON.stringify(values, null, 2));
        console.log(State.configS3)
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>S3 Configurations</label>
                <Formik
                    initialValues={setInitialValues()}
                    onSubmit={handleSubmit}
                    render={DisplayForm}
                />
        </div>)
});

export default S3Form;