import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const authorizedInstance = axios.create();
authorizedInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = "Bearer " + token;
		} else {
			return Promise.reject("You are not authorized!");
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
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
	params?: AxiosRequestConfig["params"],
	authorized = true
): Promise<AxiosResponse> =>
	authorized
		? authorizedInstance({
				method,
				url: `${process.env.REACT_APP_API}${url}`,
				data,
				params,
		  })
		: axios({
				method,
				url: `${process.env.REACT_APP_API}${url}`,
				data,
				params,
		  });

export default instance;
