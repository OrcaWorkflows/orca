import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {findIndex, timeoutMillis} from "../helper";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State, {ElasticsearchConf} from "../../../data/state";

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
        if (State.nodeConfList[index].hasOwnProperty("host")) {
            initialValues.host = (State.nodeConfList[index] as ElasticsearchConf).host;
            initialValues.index_name = (State.nodeConfList[index] as ElasticsearchConf).index_name;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setESFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        const indexToUpdate:number = findIndex(State.currentNodeClick);
        let newElasticsearchConf:ElasticsearchConf = {
            id: State.currentNodeClick,
            host: values.host,
            index_name: values.index_name,
        }
        State.nodeConfList[indexToUpdate] = newElasticsearchConf;
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
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