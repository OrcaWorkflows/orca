import { useQuery, UseQueryResult } from "react-query";

import axios from "utils/axios";

export function useGetOperatorNamesByCategory({
	categoryName,
}: {
	categoryName: string;
}): UseQueryResult<{ categoryName: string; name: string }[]> {
	const workflow = useQuery([categoryName], async () => {
		const { data } = await axios({
			method: "get",
			url: process.env.REACT_APP_API + `/api/operator/${categoryName}`,
		});
		return data;
	});
	return workflow;
}
