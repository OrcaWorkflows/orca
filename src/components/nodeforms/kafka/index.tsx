import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {delayNotification} from "../helper";

const KafkaForm = forwardRef((props, ref) => {
    const [state, setState] = useState(true)

    const hideKafkaForm = () => {
        setState(true);
    };

    const showKafkaForm = () => {
        if (!state)
            setState(true);
        else
            setState(false);
    }

    useImperativeHandle(ref, () => {
        return {
            showKafkaForm: showKafkaForm,
            hideKafkaForm: hideKafkaForm
        };
    });

    const initialValues = {
        topic_name: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        console.log({ values, actions });
        console.log(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success');
        delayNotification().then(() => hideKafkaForm());
    };

    return (
        <div className={"container"} hidden={state}>
            <NotificationContainer/>
            <label className={"label"}>Please Enter Kafka Configurations</label>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default KafkaForm;