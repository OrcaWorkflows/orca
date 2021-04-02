import axios from "axios";

const SUBMIT_API=process.env.SUBMIT_API || "https://localhost:5000/";

export default class RequestUtils {
    static submit(param:string) {
        console.log("Submit initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static resubmit(param:string) {
        console.log("Resubmit initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static suspend(param:string) {
        console.log("Suspend initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static resume(param:string) {
        console.log("Resume initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static stop(param:string) {
        console.log("Stop initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static terminate(param:string) {
        console.log("Terminate initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }

    static delete(param:string) {
        console.log("Delete initiated.");
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).catch((error) => console.log(error));
    }
}
