import React from "react";
import { Form, Field } from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "../validatefields";

const display= () => ({ handleSubmit, submitCount }) => (
    <Form onSubmit={handleSubmit}>
        <Field
            component={AntInput}
            name="broker_host"
            type="broker_host"
            placeholder="Broker Host"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="topic_name"
            type="topic_name"
            placeholder="Topic Name"
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