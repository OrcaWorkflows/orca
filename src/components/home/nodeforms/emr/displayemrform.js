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
            name="script_uri"
            type="script_uri"
            placeholder="Script Uri"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="input_uri"
            type="input_uri"
            placeholder="Input Uri"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="master_instance_type"
            type="master_instance_type"
            placeholder="Master Instance Type"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="slave_instance_type"
            type="slave_instance_type"
            placeholder="Slave Instance Type"
            submitCount={submitCount}
            validate={isRequired}
            hasFeedback
        />
        <Field
            component={AntInput}
            name="instance_count"
            type="instance_count"
            placeholder="Instance Count"
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