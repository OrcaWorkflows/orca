import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displaysystemform";
import {findIndex, timeoutMillis} from "../helper";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State, {RedisConf} from "../../data/state";

const SystemForm = forwardRef((props, ref) => {
    const [SystemFormValues, setSystemFormValues] = useState({});


    const getESFormValues = () => {
        return SystemFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            getFormValues: getESFormValues
        };
    });

    const initialValues = {
        host: "",
    };

    const setInitialValues = () => {
        const index:number = findIndex(State.currentNodeClick);
        if (State.nodeConfList[index].hasOwnProperty("host")) {
            initialValues.host = State.redisConf.host;
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setSystemFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.redisConf.host = JSON.parse(JSON.stringify(values, null, 2))["host"];
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

export default SystemForm;