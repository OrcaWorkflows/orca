import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {findIndex, timeoutMillis} from "../helper";
import State, {KafkaConf} from "../../data/state";

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
        const index:number = findIndex(State.currentNodeClick);
        if (State.nodeConfList[index].hasOwnProperty("broker_host")) {
            initialValues.broker_host = (State.nodeConfList[index] as KafkaConf).broker_host;
            initialValues.topic_name = (State.nodeConfList[index] as KafkaConf).topic_name;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setKafkaFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newKafkaConf:KafkaConf = {
            id: State.currentNodeClick,
            broker_host: values.broker_host,
            topic_name: values.topic_name,
        }
        State.nodeConfList[indexToUpdate] = newKafkaConf;
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