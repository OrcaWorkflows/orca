import React from "react";
import { Form, Field } from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "./validatefields";

export default ({ handleSubmit, submitCount }) => (
    <Form className="form-container" onSubmit={handleSubmit}>
        <Field
            component={AntInput}
            name="bucket_name"
            type="bucket_name"
            label="Bucket Name"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="file_path"
            type="file_path"
            label="File Name"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="file_type"
            type="file_type"
            label="File Type"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <button className="topbarbutton" type="submit">
            Save
        </button>
    </Form>
);
