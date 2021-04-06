import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {delayNotification} from "../helper";
import {NotificationContainer, NotificationManager} from "react-notifications";

const ESForm = forwardRef((props, ref) => {
    const [state, setState] = useState(true)

    const hideESForm = () => {
        setState(true);
    };

    const showESForm = () => {
        if(!state)
            setState(true);
        else
            setState(false);
    }

    useImperativeHandle(ref, () => {
        return {
            showESForm: showESForm,
            hideEsForm: hideESForm
        };
    });

    const initialValues = {
        index_name: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        console.log({ values, actions });
        console.log(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success');
        delayNotification().then(() => hideESForm());
    };

    return (
        <div className={"container"} hidden={state}>
            <NotificationContainer/>
            <label className={"label"}>Please Enter Elasticsearch Configurations</label>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default ESForm;