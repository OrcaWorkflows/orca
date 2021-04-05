import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";

const KafkaForm = forwardRef((props, ref) => {
    const [state, setState] = useState(true)

    const hideKafkaForm = () => {
        setState(true);
    };

    const showKafkaForm = () => {
        if (!state)
            setState(true);
        else
            setState(false);
    }

    useImperativeHandle(ref, () => {
        return {
            showKafkaForm: showKafkaForm
        };
    });

    const initialValues = {
        topic_name: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        console.log({ values, actions });
        console.log(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        hideKafkaForm();
    };

    return (
        <div className={"container"} hidden={state}>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={DisplayForm}
            />
        </div>)
});

export default KafkaForm;