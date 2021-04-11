import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {delayNotification, timeoutMillis} from "../helper";
import State from "../../data/state";

const KafkaForm = forwardRef((props, ref) => {
    const [KafkaFormValues, setKafkaFormValues] = useState({});

    const getKafkaFormValues = () => {
        return KafkaFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getKafkaFormValues
        };
    });

    const initialValues = {
        topic_name: "",
        broker_host: ""
    };

    const handleSubmit = (values: any, actions: any) => {
        setKafkaFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.configKafka = JSON.parse(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        delayNotification().then(() => NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis));
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>Kafka Configurations</label>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default KafkaForm;