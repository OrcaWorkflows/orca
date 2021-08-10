import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = "Bearer " + token;
		} else {
			Promise.reject("You are not authorized!");
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

axios.interceptors.response.use((response) => {
	const token = response.headers.authorization;
	if (token && token !== localStorage.getItem("token")) {
		localStorage.setItem("token", token);
	}
	return response;
});

const instance = (
	method: AxiosRequestConfig["method"],
	url: AxiosRequestConfig["url"],
	data?: AxiosRequestConfig["data"],
	params?: AxiosRequestConfig["params"]
): Promise<AxiosResponse> => {
	return axios({
		method,
		url: `${process.env.REACT_APP_API}${url}`,
		data,
		params,
	});
};

export default instance;
