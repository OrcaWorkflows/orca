import React from "react";
import {Form, Field} from "formik";
import {
    AntInput
} from "../createantfields";
import {
    isRequired
} from "../validatefields";

const display = () => ({handleSubmit, submitCount}) => (
    <Form onSubmit={handleSubmit}>
        <div className={"content-conf"}>
            <div className={"system-conf"}>Redis</div>
            <Field
                component={AntInput}
                name="redis_host"
                type="redis_host"
                placeholder="Redis Host"
                submitCount={submitCount}
                validate={isRequired}
                hasFeedback
            />
            <div className={"margin-top"}>
                <button className="form-button" type="submit">
                    Save
                </button>
            </div>
        </div>
    </Form>
);
export default display();