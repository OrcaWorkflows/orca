import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayemrform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {EMRConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";
import {Elements, FlowElement, Node} from "react-flow-renderer";
import {setCanvas} from "../../../../actions/canvas_actions";


const EMRForm = forwardRef((props: {nodes: Elements, setNodes: ((value: Elements | ((prevVar: Elements) => Elements)) => void), edges: Elements}, ref) => {
    const [EMRFormValues, setEMRFormValues] = useState();

    const getEMRFormValues = () => {
        return EMRFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getEMRFormValues
        };
    });

    const initialValues = {
        script_uri: "",
        input_uri: "",
        master_instance_type: "m5.xlarge",
        slave_instance_type: "m5.xlarge",
        instance_count: "3"
    };

    const setInitialValues = () => {
        const currentNodeClick = localStorage.getItem("currentNodeClick");
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === currentNodeClick);
        if ((props.nodes[index] as Node).data.hasOwnProperty("conf")) {
            const nodeConf : EMRConf = (props.nodes[index] as Node).data.conf;
            initialValues.script_uri = nodeConf.script_uri;
            initialValues.input_uri = nodeConf.input_uri;
            initialValues.master_instance_type = nodeConf.master_instance_type;
            initialValues.slave_instance_type = nodeConf.slave_instance_type;
            initialValues.instance_count = nodeConf.instance_count;
        }
        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setEMRFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const currentNodeClick = localStorage.getItem("currentNodeClick") as string;
        const indexToUpdate = props.nodes.findIndex((node:FlowElement) => (node as Node).id === currentNodeClick);
        let newEMRConf:EMRConf = {
            id: currentNodeClick,
            script_uri: values.script_uri,
            input_uri: values.input_uri,
            master_instance_type: values.master_instance_type,
            slave_instance_type: values.slave_instance_type,
            instance_count: values.instance_count,
        }
        actions.setSubmitting(false);
        let node:FlowElement = props.nodes[indexToUpdate];
        const newNode = {...node, data:{...node.data, conf: newEMRConf}};
        const newNodes = [...props.nodes];
        newNodes[indexToUpdate] = newNode;
        props.setNodes(newNodes);
        setCanvas(newNodes, props.edges);
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>EMR Configurations</label>
                <Formik
                    initialValues={setInitialValues()}
                    onSubmit={handleSubmit}
                    render={DisplayForm}
                />
        </div>)
});

export default EMRForm;