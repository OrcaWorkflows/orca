import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {findIndex, timeoutMillis} from "../helper"
import State, {S3Conf} from "../../data/state";

const S3Form = forwardRef((props, ref) => {
    const [S3FormValues, setS3FormValues] = useState();

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
        const index:number = findIndex(State.currentNodeClick);
        if (State.nodeConfList[index].hasOwnProperty("bucket_name")) {
            initialValues.bucket_name = (State.nodeConfList[index] as S3Conf).bucket_name;
            initialValues.file_path = (State.nodeConfList[index] as S3Conf).file_path;
            initialValues.file_type = (State.nodeConfList[index] as S3Conf).file_type;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setS3FormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newS3Conf:S3Conf = {
            id: State.currentNodeClick,
            bucket_name: values.bucket_name,
            file_path: values.file_path,
            file_type: values.file_type,
        }
        State.nodeConfList[indexToUpdate] = newS3Conf;
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