import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {timeoutMillis} from "../helper";
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

    const setInitialValues = () => {
        if (State.configKafka !== undefined) {
            initialValues.broker_host = State.configKafka["broker_host"];
            initialValues.topic_name = State.configKafka["topic_name"];
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setKafkaFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.configKafka = JSON.parse(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>Kafka Configurations</label>
            <Formik
                initialValues={setInitialValues()}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default KafkaForm;