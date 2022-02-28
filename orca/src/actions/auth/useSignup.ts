import { AxiosResponse} from "axios";
import { useMutation, UseMutationResult } from "react-query";
import { useHistory } from "react-router-dom";

import { axios } from "utils";

export type Values = {
	email: string;
	username: string;
	password: string;
	organizationName: string;
};

export const useSignup = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const history = useHistory();
	const signup = useMutation(
		async ({ email, username, password, organizationName }: Values) =>
			axios(
				{
					method: "post",
					url: process.env.REACT_APP_API + "/users/signup",
					data: {
						email,
						username,
						password,
						organizationName,
					},
				},
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
