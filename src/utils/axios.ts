import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const instance = (
	method: AxiosRequestConfig["method"],
	url: AxiosRequestConfig["url"],
	data: AxiosRequestConfig["data"]
): Promise<AxiosResponse> => {
	return axios({
		method,
		url: `${process.env.REACT_APP_API}${url}`,
		data,
	});
};

export default instance;
