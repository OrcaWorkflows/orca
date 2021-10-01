import { AxiosResponse } from "axios";
import { useMutation, UseMutationResult } from "react-query";

import { axios } from "utils";

export type Values = {
	email?: string;
	password?: string;
	phoneNumber?: string;
};

export const useUpdateUser = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const username = localStorage.getItem("username");

	const signup = useMutation(async ({ email, password, phoneNumber }: Values) =>
		axios({
			method: "post",
			url: process.env.REACT_APP_API + `/users/user/${username}`,
			data: {
				email,
				password,
				phoneNumber,
			},
		})
	);
	return signup;
};
