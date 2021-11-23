import { AxiosResponse } from "axios";
import { useMutation, UseMutationResult } from "react-query";

import { axios } from "utils";

export type Values = {
	email?: string;
	password?: string;
	organizationName?: string;
};

export const useUpdateUser = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const username = JSON.parse(localStorage.getItem("user") as string).username;

	const signup = useMutation(async ({ email, password, organizationName }: Values) =>
		axios({
			method: "post",
			url: process.env.REACT_APP_API + `/users/user/${username}`,
			data: {
				email,
				password,
				organizationName,
			},
		})
	);
	return signup;
};
