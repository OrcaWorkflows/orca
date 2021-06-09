import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {findIndex} from "../../../utils/helper";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State, {ElasticsearchConf, NodeConf} from "../../../data/state";
import {notificationTimeoutMillis} from "../../../../config";

const ESForm = forwardRef((props, ref) => {
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
        const index:number = findIndex(State.currentNodeClick);
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        if (nodeConfList[index].hasOwnProperty("host")) {
            initialValues.host = (nodeConfList[index] as ElasticsearchConf).host;
            initialValues.index_name = (nodeConfList[index] as ElasticsearchConf).index_name;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setESFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        let nodeConfList:Array<NodeConf> = JSON.parse(localStorage.getItem("nodes") as string) as Array<NodeConf>;
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newElasticsearchConf:ElasticsearchConf = {
            id: State.currentNodeClick,
            host: values.host,
            index_name: values.index_name,
        }
        actions.setSubmitting(false);
        nodeConfList[indexToUpdate] = newElasticsearchConf;
        localStorage.setItem("nodes", JSON.stringify(nodeConfList));
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