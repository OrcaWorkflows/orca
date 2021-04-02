import axios from "axios";

const SUBMIT_API=process.env.SUBMIT_API || "https://localhost:5000/submit";

export default class SubmitRequestUtils {
    static submit(param:string) {
        console.log(param);
        const newAxios=axios.create({
            headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'multipart/form-data',
                'Auth': ` eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJpZ19kYXRhIiwicGFzc3dvcmQiOiJiaWdfZGF0YSJ9.xIa0Qn9ITJjSTW2NeiM3abKeIWzrlF3nl9Wt_qKm0d0`
            }
        })
        newAxios.post(SUBMIT_API,param,
            {}).then((response) => console.log(response)).
        catch((error) => console.log(error));
    }
}
