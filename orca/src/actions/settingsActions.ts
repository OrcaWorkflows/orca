import { AxiosResponse } from "axios";
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryResult,
	UseMutationResult,
} from "react-query";

import { IOperatorConfig } from "interfaces";
import axios from "utils/axios";

export function useGetAllOperatorConfigs(): UseQueryResult<IOperatorConfig[]> {
	const allOperatorConfigs = useQuery(["allOperatorConfigs"], async () => {
		const { data } = await axios({
			method: "get",
			url: process.env.REACT_APP_API + "/api/system-config",
		});
		return data;
	});

	return allOperatorConfigs;
}

export function useGetOperatorConfig({
	configID,
}: {
	configID?: number;
}): UseQueryResult<IOperatorConfig> {
	const operatorConfig = useQuery(
		["operatorConfig", configID],
		async (): Promise<IOperatorConfig> => {
			const { data } = await axios({
				method: "get",
				url: process.env.REACT_APP_API + `/api/system-config/${configID}`,
			});
			return data;
		},
		{
			enabled: Boolean(configID),
		}
	);

	return operatorConfig;
}

type ConfigParameters = {
	id?: number;
	hostList?: { host: string }[];
	name: string;
	operatorName: string;
	password?: string;
	property?: unknown;
	username?: string;
};
export const useUpsertOperatorConfig = (): UseMutationResult<
	IOperatorConfig,
	unknown,
	ConfigParameters,
	unknown
> => {
	const queryClient = useQueryClient();

	const upsertOperatorConfig = useMutation(
		async ({
			id,
			name,
			hostList = [], // Required by endpoint for any type of operatorName
			operatorName,
			password,
			property,
			username,
		}: ConfigParameters): Promise<IOperatorConfig> => {
			const { data } = await axios({
				method: "post",
				url: process.env.REACT_APP_API + "/api/system-config",
				data: {
					id,
					hostList,
					name,
					operatorName,
					password,
					property,
					username,
				},
			});
			return data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["allOperatorConfigs"]);
			},
		}
	);
	return upsertOperatorConfig;
};

export const useDeleteOperatorConfig = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ id: number },
	unknown
> => {
	const queryClient = useQueryClient();

	const deleteOperatorConfig = useMutation(
		async ({ id }: { id: number }) => {
			const { data } = await axios({
				method: "delete",
				url: process.env.REACT_APP_API + `/api/system-config/${id}`,
			});
			return data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["allOperatorConfigs"]);
			},
		}
	);
	return deleteOperatorConfig;
};
