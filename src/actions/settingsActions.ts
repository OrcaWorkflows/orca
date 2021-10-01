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
	hostList?: { host: string }[];
	name: string;
	operatorName: string;
	password?: string;
	property?: unknown;
	username?: string;
};
export const useUpsertOperatorConfig = ({
	configID,
}: {
	configID?: number;
}): UseMutationResult<IOperatorConfig, unknown, ConfigParameters, unknown> => {
	const queryClient = useQueryClient();

	const upsertOperatorConfig = useMutation(
		async ({
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
					id: configID,
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

export const useDeleteOperatorConfig = ({
	configID,
}: {
	configID: number;
}): UseMutationResult<AxiosResponse, unknown, void, unknown> => {
	const queryClient = useQueryClient();

	const deleteOperatorConfig = useMutation(
		async () => {
			const { data } = await axios({
				method: "delete",
				url: process.env.REACT_APP_API + `/api/system-config/${configID}`,
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
