import React from 'react';
import {Field, Form, Formik} from "formik";
import {AntInput, AntPassword} from "../home/nodeforms/createantfields";
import {isRequired} from "../home/nodeforms/validatefields";
import {NotificationContainer, NotificationManager} from "react-notifications";
import './auth.scss'
import logo from "../../assets/logo/vector/default-monochrome-black.svg";
import {signinUser} from "../../actions/auth_actions";
import { useHistory } from 'react-router-dom';
import {notificationTimeoutMillis} from "../../config";

const Login = () => {
    const initialValues = {
        username: "",
        password: ""
    };
    const history = useHistory();
    const handleSubmit = (values: any, actions: any) => {
        actions.setSubmitting(false);
        signinUser(values["username"], values["password"], history);
    };

    const handleRegister = () => {
        NotificationManager.error('Registration is Closed. Please Try again later.', 'Error', notificationTimeoutMillis);
    };

    return (
        <div className={"login"}>
            <NotificationContainer/>
            <div className={"login-form"}>
                <img src={logo} alt={"auth-title"}/>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}>
                    <Form>
                        <Field
                            component={AntInput}
                            name="username"
                            type="username"
                            placeholder="User Name"
                            validate={isRequired}
                            hasFeedback
                        />
                        <Field
                            component={AntPassword}
                            name="password"
                            type="password"
                            placeholder="Password"
                            validate={isRequired}
                            hasFeedback
                        />
                        <div className={"margin-top"}>
                            <button className="form-button" type="submit">
                                Login
                            </button>
                        </div>
                    </Form>
                </Formik>
                <Formik initialValues={initialValues} onSubmit={handleRegister}>
                    <Form>
                        <div className={"register"}>
                            <button className="form-button" type="submit">
                                Register
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Login;