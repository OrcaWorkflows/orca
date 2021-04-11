import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displayawsform";
import {timeoutMillis} from "../helper";
import {NotificationContainer, NotificationManager} from "react-notifications";
import State from "../../data/state";

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
        if (State.configES !== undefined) {
            initialValues.host = State.configES["host"];
            initialValues.index_name = State.configES["index_name"];
        }

        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setESFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        State.configES = JSON.parse(JSON.stringify(values, null, 2));
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