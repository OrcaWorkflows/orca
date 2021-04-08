import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {delayNotification, timeoutMillis} from "../helper";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State from "../../data/state";

const ESForm = forwardRef((props, ref) => {
    const [state, setState] = useState(true);
    const [ESFormValues, setESFormValues] = useState({});

    const hideESForm = () => {
        setState(true);
    };

    const showESForm = () => {
        if(!state)
            setState(true);
        else
            setState(false);
    }

    const getESFormValues = () => {
        return ESFormValues;
    }

    useImperativeHandle(ref, () => {
        return {
            showESForm: showESForm,
            hideEsForm: hideESForm,
            getFormValues: getESFormValues
        };
    });

    const initialValues = {
        index_name: "",
        host: ""
    };

    const handleSubmit = (values: any, actions: any) => {
        setESFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.configES = JSON.parse(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', timeoutMillis);
        delayNotification().then(() => hideESForm());
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"label"}>Elasticsearch Configurations</label>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default ESForm;