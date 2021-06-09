import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {findIndex} from "../../../utils/helper";
import State, {KafkaConf, NodeConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";

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
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        if (nodeConfList[index].hasOwnProperty("broker_host")) {
            initialValues.broker_host = (nodeConfList[index] as KafkaConf).broker_host;
            initialValues.topic_name = (nodeConfList[index] as KafkaConf).topic_name;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setKafkaFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newKafkaConf:KafkaConf = {
            id: State.currentNodeClick,
            broker_host: values.broker_host,
            topic_name: values.topic_name,
        }
        actions.setSubmitting(false);
        nodeConfList[indexToUpdate] = newKafkaConf;
        localStorage.setItem("nodes", JSON.stringify(nodeConfList));
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
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