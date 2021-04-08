import React from "react";
import { Form, Field } from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "../validatefields";

const display= () => ({ handleSubmit, submitCount }) => (
    <Form className="form-container" onSubmit={handleSubmit}>
        <Field
            component={AntInput}
            name="broker_host"
            type="broker_host"
            label="Broker Host"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="topic_name"
            type="topic_name"
            label="Topic Name"
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