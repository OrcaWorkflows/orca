import React, {forwardRef, useImperativeHandle, useState} from 'react';

import {Formik} from 'formik';
import DisplayForm from "./displayawsform";

const S3Form = forwardRef((props, ref) => {
    const [state, setState] = useState(true)

    const hideS3Form = () => {
        setState(true);
    };

    const showS3Form = () => {
        if (!state)
            setState(true);
        else
            setState(false);
    }

    useImperativeHandle(ref, () => {
        return {
            showS3Form: showS3Form,
            hideS3Form: hideS3Form
        };
    });

    const initialValues = {
        bucket_name: "",
        file_path: "",
        file_type: "",
    };

    const handleSubmit = (values: any, actions: any) => {
        console.log({ values, actions });
        console.log(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        hideS3Form();
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

export default S3Form;