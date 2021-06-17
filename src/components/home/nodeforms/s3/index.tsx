import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State, {S3Conf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";
import {Elements, FlowElement, Node} from "react-flow-renderer";
import {setCanvas} from "../../../../actions/canvas_actions";


const S3Form = forwardRef((props: {nodes: Elements, setNodes: ((value: Elements | ((prevVar: Elements) => Elements)) => void), edges: Elements}, ref) => {
    const [S3FormValues, setS3FormValues] = useState();

    const getS3FormValues = () => {
        return S3FormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getS3FormValues
        };
    });

    const initialValues = {
        bucket_name: "",
        file_path: "",
        file_type: "",
    };

    const setInitialValues = () => {
        const currentNodeClick = localStorage.getItem("currentNodeClick");
        const index = props.nodes.findIndex((node:FlowElement) => (node as Node).id === currentNodeClick);
        if ((props.nodes[index] as Node).data.hasOwnProperty("conf")) {
            const nodeConf : S3Conf = (props.nodes[index] as Node).data.conf;
            initialValues.bucket_name = nodeConf.bucket_name;
            initialValues.file_path = nodeConf.file_path;
            initialValues.file_type = nodeConf.file_type;
        }
        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setS3FormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const currentNodeClick = localStorage.getItem("currentNodeClick") as string;
        const indexToUpdate = props.nodes.findIndex((node:FlowElement) => (node as Node).id === currentNodeClick);
        let newS3Conf:S3Conf = {
            id: currentNodeClick,
            bucket_name: values.bucket_name,
            file_path: values.file_path,
            file_type: values.file_type,
        }
        actions.setSubmitting(false);
        let node:FlowElement = props.nodes[indexToUpdate];
        const newNode = {...node, data:{...node.data, conf: newS3Conf}};
        const newNodes = [...props.nodes];
        newNodes[indexToUpdate] = newNode;
        props.setNodes(newNodes);
        setCanvas(newNodes, props.edges);
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>S3 Configurations</label>
                <Formik
                    initialValues={setInitialValues()}
                    onSubmit={handleSubmit}
                    render={DisplayForm}
                />
        </div>)
});

export default S3Form;