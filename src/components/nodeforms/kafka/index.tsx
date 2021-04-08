import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {delayNotification, timeoutMillis} from "../helper";
import State from "../../data/state";

const KafkaForm = forwardRef((props, ref) => {
    const [state, setState] = useState(true);
    const [KafkaFormValues, setKafkaFormValues] = useState({});

    const hideKafkaForm = () => {
        setState(true);
    };

    const showKafkaForm = () => {
        if (!state)
            setState(true);
        else
            setState(false);
    }

    const getKafkaFormValues = () => {
        return KafkaFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            showKafkaForm: showKafkaForm,
            hideKafkaForm: hideKafkaForm,
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
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
        delayNotification().then(() => hideKafkaForm());
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"label"}>Kafka Configurations</label>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default KafkaForm;