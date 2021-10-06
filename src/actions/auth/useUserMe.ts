import { useQuery, UseQueryResult } from "react-query";

import { axios } from "utils";

export type Me = {
	createdAt: number;
	email: string;
	phoneNumber: string;
	updatedAt: number;
	username: string;
};

export const useUserMe = (): UseQueryResult<any> => {
	const me = useQuery(
		["me"],
		async () => {
			const { data } = await axios({
				method: "get",
				url: process.env.REACT_APP_API + `/users/me`,
			});
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("user", JSON.stringify(data));
			},
		}
	);
	return me;
};
