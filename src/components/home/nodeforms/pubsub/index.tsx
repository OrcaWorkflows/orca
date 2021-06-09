import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displaygcpform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {findIndex} from "../../../utils/helper"
import State, {NodeConf, PubSubConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";

const PubSubForm = forwardRef((props, ref) => {
    const [PubSubFormValues, setPubSubFormValues] = useState();

    const getPubSubFormValues = () => {
        return PubSubFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getPubSubFormValues
        };
    });

    const initialValues = {
        project_id: "akis-295110",
        topic: "",
        topic_action: "",
        timeout: 10,
    };

    const setInitialValues = () => {
        const index:number = findIndex(State.currentNodeClick);
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        if (nodeConfList[index].hasOwnProperty("topic")) {
            initialValues.project_id = (nodeConfList[index] as PubSubConf).project_id;
            initialValues.topic = (nodeConfList[index] as PubSubConf).topic;
            initialValues.topic_action = (nodeConfList[index] as PubSubConf).topic_action;
            initialValues.timeout = (nodeConfList[index] as PubSubConf).timeout;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setPubSubFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newPubSubConf:PubSubConf = {
            id: State.currentNodeClick,
            project_id: values.project_id,
            topic: values.topic,
            topic_action: values.topic_action,
            timeout: values.timeout,
        }
        actions.setSubmitting(false);
        nodeConfList[indexToUpdate] = newPubSubConf;
        localStorage.setItem("nodes", JSON.stringify(nodeConfList));
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>PubSub Configurations</label>
                <Formik
                    initialValues={setInitialValues()}
                    onSubmit={handleSubmit}
                    render={DisplayForm}
                />
        </div>)
});

export default PubSubForm;