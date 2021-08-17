import { AxiosResponse } from "axios";
import { Elements } from "react-flow-renderer";
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseMutationResult,
} from "react-query";

import { axios } from "utils";

export function useGetCanvas(
	canvasID: number,
	enabled: boolean
): {
	isError: boolean;
	nodes: Elements;
	edges: Elements;
	workflowName: string;
} {
	const canvas = useQuery(
		["canvas", canvasID],
		async () => {
			const { data } = await axios("get", `/api/canvas/${canvasID}`);
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("lastCanvasId", JSON.stringify(data.id));
			},
			enabled,
		}
	);
	return {
		isError: canvas.isError,
		nodes: canvas.data?.property.nodes,
		edges: canvas.data?.property.edges,
		workflowName: canvas.data?.workflowName,
	};
}

type Values = { id: number; property: { nodes: Elements; edges: Elements } };
export const useSetCanvas = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const queryClient = useQueryClient();

	const setCanvas = useMutation(
		async ({ id, property }: Values) => {
			const mutatedCanvas:
				| {
						createdAt: number;
						id: number;
						property: { nodes: Elements; edges: Elements };
						updatedAt: number;
						workflowName: string;
				  }
				| undefined = queryClient.getQueryData(["canvas", id]);
			const { data } = await axios("post", "/api/canvas", {
				id,
				property,
				workflowName: mutatedCanvas?.workflowName ?? "workflow-",
			});
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("lastCanvasId", JSON.stringify(data.id));
				queryClient.invalidateQueries(["canvas", data.id]);
			},
		}
	);
	return setCanvas;
};
