import axios from "axios";
import {NotificationManager} from "react-notifications";
import {API, notificationTimeoutMillis} from "../config";

export function signinUser(username:string, password:string, history:any) {
    axios.post(API + "users/signin", {username, password})
            .then(response => {
                NotificationManager.success('', 'Login successful.', notificationTimeoutMillis);
                localStorage.setItem('token', response.data.key);
                localStorage.setItem("username", username);
                history.push("/home");
            })
            .catch((error) => {
                NotificationManager.error(error.toString(), 'Error.', notificationTimeoutMillis);
            });
}