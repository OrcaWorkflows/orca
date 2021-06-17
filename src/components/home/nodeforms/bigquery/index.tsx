import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displaygcpform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State, {BigQueryConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";
import {Elements, FlowElement, Node} from "react-flow-renderer";
import {setCanvas} from "../../../../actions/canvas_actions";

const BigQueryForm = forwardRef((props: {nodes: Elements, setNodes: ((value: Elements | ((prevVar: Elements) => Elements)) => void), edges: Elements}, ref) => {
    const [BigQueryFormValues, setBigQueryFormValues] = useState();

    const getBigQueryFormValues = () => {
        return BigQueryFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getBigQueryFormValues
        };
    });

    const initialValues = {
        project_id: "akis-295110",
        dataset_id: "",
        table_id: "",
        query: "",
    };

    const setInitialValues = () => {
        const currentNodeClick = localStorage.getItem("currentNodeClick");
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === currentNodeClick);
        if ((props.nodes[index] as Node).data.hasOwnProperty("conf")) {
            const nodeConf : BigQueryConf = (props.nodes[index] as Node).data.conf;
            initialValues.dataset_id = nodeConf.dataset_id;
            initialValues.table_id = nodeConf.table_id;
            initialValues.query = nodeConf.query;
        }
        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setBigQueryFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const currentNodeClick = localStorage.getItem("currentNodeClick") as string;
        const indexToUpdate = props.nodes.findIndex((node:FlowElement) => (node as Node).id === currentNodeClick);
        let newBigQueryConf:BigQueryConf = {
            id: currentNodeClick,
            project_id: values.project_id,
            dataset_id: values.dataset_id,
            table_id: values.table_id,
            query: values.query,
        }
        actions.setSubmitting(false);
        let node:FlowElement = props.nodes[indexToUpdate]
        const newNode = {...node, data:{...node.data, conf: newBigQueryConf}}
        const newNodes = [...props.nodes]
        newNodes[indexToUpdate] = newNode
        props.setNodes(newNodes);
        setCanvas(newNodes, props.edges);
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>BigQuery Configurations</label>
                <Formik
                    initialValues={setInitialValues()}
                    onSubmit={handleSubmit}
                    render={DisplayForm}
                />
        </div>)
});

export default BigQueryForm;