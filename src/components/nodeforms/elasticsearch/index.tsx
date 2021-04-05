import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";

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
            showESForm: showESForm
        };
    });

    const initialValues = {
        index_name: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        console.log({ values, actions });
        console.log(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        hideESForm();
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

export default ESForm;