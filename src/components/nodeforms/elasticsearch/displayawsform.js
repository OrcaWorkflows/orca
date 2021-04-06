import React from "react";
import { Form, Field } from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "../validatefields";

export default ({ handleSubmit, submitCount }) => (
    <Form className="form-container" onSubmit={handleSubmit}>
        <Field
            component={AntInput}
            name="index_name"
            type="index_name"
            label="Index Name"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <button className="topbarbutton" type="submit">
            Save
        </button>
    </Form>
);
