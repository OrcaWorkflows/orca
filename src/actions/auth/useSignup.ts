import { AxiosResponse } from "axios";
import { useMutation, UseMutationResult } from "react-query";
import { useHistory } from "react-router-dom";

import { axios } from "utils";

export type Values = {
	email: string;
	username: string;
	password: string;
	phoneNumber: string;
};

export const useSignup = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const history = useHistory();
	const signup = useMutation(
		async ({ email, username, password, phoneNumber }: Values) =>
			axios(
				"post",
				"/users/signup",
				{
					email,
					username,
					password,
					phoneNumber,
				},
				undefined,
				false
			),
		{
			onSuccess: () => {
				history.push("/");
			},
		}
	);
	return signup;
};
