import { useQuery, UseQueryResult } from "react-query";

import { axios } from "utils";

export const useUserMe = (): UseQueryResult<any> => {
	const me = useQuery(["me"], async () => {
		const { data } = await axios({
			method: "get",
			url: process.env.REACT_APP_API + `/users/me`,
		});
		return data;
	});
	return me;
};
