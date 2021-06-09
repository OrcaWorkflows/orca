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
            <div className={"margin-top"}>

            </div>
        </div>
    </Form>
);
export default display();