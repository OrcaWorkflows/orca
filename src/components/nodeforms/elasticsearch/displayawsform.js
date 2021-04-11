import React from "react";
import { Form, Field } from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "../validatefields";

const display = () => ({ handleSubmit, submitCount }) => (
    <Form onSubmit={handleSubmit}>
        <Field
            component={AntInput}
            name="host"
            type="host"
            label="Host"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
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
export default display();