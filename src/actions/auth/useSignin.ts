import { AxiosResponse } from "axios";
import { useMutation, UseMutationResult } from "react-query";
import { useHistory } from "react-router-dom";

import { axios } from "utils";

export type Values = { username: string; password: string };

export const useSignin = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const history = useHistory();
	const signin = useMutation(
		async ({ username, password }: Values) =>
			axios("post", "/users/signin", { username, password }),
		{
			onSuccess: (response) => {
				localStorage.setItem("token", response.data.key);
				history.push("/home");
			},
		}
	);
	return signin;
};
