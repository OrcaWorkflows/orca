import React, {forwardRef, useImperativeHandle, useState} from 'react';


import {Formik} from 'formik';
import DisplayForm from "./displaysystemform";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {notificationTimeoutMillis} from "../../../../config";

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
    };

    const setInitialValues = () => {
        return initialValues;
    };

    const handleSubmit = (values: any, actions: any) => {
        setSystemFormValues(JSON.parse(JSON.stringify(values, null, 2)));
        actions.setSubmitting(false);
        NotificationManager.success('Successfully Saved Configurations', 'Success', notificationTimeoutMillis);
    };

    return (
        <div className={"container"}>
            <NotificationContainer/>
            <label className={"form-label"}>System Configurations</label>
            <Formik
                initialValues={setInitialValues()}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default SystemForm;