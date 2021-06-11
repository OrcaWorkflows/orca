import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displaygcpform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {findIndex} from "../../../utils/helper"
import State, {PubSubConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";
import {Elements, FlowElement, Node} from "react-flow-renderer";

const PubSubForm = forwardRef((props: {nodes: Elements, setNodes: ((value: Elements | ((prevVar: Elements) => Elements)) => void)}, ref) => {
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
        topic_action: ""
    };

    const setInitialValues = () => {
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === State.currentNodeClick);
        if ((props.nodes[index] as Node).data.hasOwnProperty("conf")) {
            const nodeConf : PubSubConf = (props.nodes[index] as Node).data.conf;
            initialValues.project_id = nodeConf.project_id;
            initialValues.topic = nodeConf.topic;
            initialValues.topic_action = nodeConf.topic_action;
        }
        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setPubSubFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === State.currentNodeClick);
        let newPubSubConf:PubSubConf = {
            id: State.currentNodeClick,
            project_id: values.project_id,
            topic: values.topic,
            topic_action: values.topic_action,
        }
        actions.setSubmitting(false);
        let node:FlowElement = props.nodes[index]
        const newNode = {...node, data:{...node.data, conf: newPubSubConf}}
        const newNodes = [...props.nodes]
        newNodes[index] = newNode
        props.setNodes(newNodes);
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