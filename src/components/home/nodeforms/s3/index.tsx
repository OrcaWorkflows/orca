import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {findIndex} from "../../../utils/helper"
import State, {NodeConf, S3Conf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";

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
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        console.log(nodeConfList[0]);
        if (nodeConfList[index].hasOwnProperty("bucket_name")) {
            initialValues.bucket_name = (nodeConfList[index] as S3Conf).bucket_name;
            initialValues.file_path = (nodeConfList[index] as S3Conf).file_path;
            initialValues.file_type = (nodeConfList[index] as S3Conf).file_type;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setS3FormValues(JSON.parse(JSON.stringify(values, null, 2)));
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newS3Conf:S3Conf = {
            id: State.currentNodeClick,
            bucket_name: values.bucket_name,
            file_path: values.file_path,
            file_type: values.file_type,
        }
        actions.setSubmitting(false);
        nodeConfList[indexToUpdate] = newS3Conf;
        localStorage.setItem("nodes", JSON.stringify(nodeConfList));
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
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