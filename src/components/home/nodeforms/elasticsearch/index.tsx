import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State, {ElasticsearchConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";
import {Elements, FlowElement, Node} from "react-flow-renderer";

const ESForm = forwardRef((props: {nodes: Elements, setNodes: ((value: Elements | ((prevVar: Elements) => Elements)) => void)}, ref) => {
    const [ESFormValues, setESFormValues] = useState({});

    const getESFormValues = () => {
        return ESFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getESFormValues
        };
    });

    const initialValues = {
        host: "",
        index_name: ""
    };

    const setInitialValues = () => {
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === State.currentNodeClick);
        if ((props.nodes[index] as Node).data.hasOwnProperty("conf")) {
            const nodeConf : ElasticsearchConf = (props.nodes[index] as Node).data.conf;
            initialValues.host = nodeConf.host;
            initialValues.index_name = nodeConf.index_name;
        }
        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setESFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === State.currentNodeClick);
        let newElasticsearchConf:ElasticsearchConf = {
            id: State.currentNodeClick,
            host: values.host,
            index_name: values.index_name,
        }
        actions.setSubmitting(false);
        let node:FlowElement = props.nodes[index]
        const newNode = {...node, data:{...node.data, conf: newElasticsearchConf}}
        const newNodes = [...props.nodes]
        newNodes[index] = newNode
        props.setNodes(newNodes);
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>Elasticsearch Configurations</label>
            <Formik
                initialValues={setInitialValues()}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default ESForm;