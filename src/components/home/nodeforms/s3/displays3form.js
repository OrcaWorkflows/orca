import React from "react";
import {Form, Field} from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "../validatefields";
import "../forms.scss";

const display = () => ({handleSubmit, submitCount}) => (
    <Form onSubmit={handleSubmit}>
        <Field
            component={AntInput}
            name="bucket_name"
            type="bucket_name"
            placeholder="Bucket Name"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="file_path"
            type="file_path"
            placeholder="File Name"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="file_type"
            type="file_type"
            placeholder="File Type"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <div className={"margin-top"}>
            <button className="form-button" type="submit">
                Save
            </button>
        </div>
    </Form>
);
export default display();