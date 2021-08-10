import { Dispatch, SetStateAction } from "react";

import { AxiosResponse } from "axios";
import { Elements } from "react-flow-renderer";
import {
	useMutation,
	UseMutationResult,
	useQuery,
	UseQueryResult,
} from "react-query";

import { axios } from "utils";

export function useGetCanvas(
	canvasId: number,
	setEdges: Dispatch<SetStateAction<Elements>>,
	setNodes: Dispatch<SetStateAction<Elements>>,
	setCounter: Dispatch<SetStateAction<number>>,
	enabled: boolean
): UseQueryResult {
	const canvas = useQuery(
		["canvas", canvasId],
		async () => {
			const { data } = await axios("get", `/api/canvas/${canvasId}`);
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("lastCanvasId", JSON.stringify(data.id));
				setEdges(data.property.edges);
				setNodes(data.property.nodes);
				setCounter(data.property.nodes.length);
			},
			enabled,
		}
	);
	return canvas;
}

type Values = { id: number; property: { nodes: Elements; edges: Elements } };

export const useSetCanvas = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const setCanvas = useMutation(
		async ({ id, property }: Values) => {
			const { data } = await axios("post", "/api/canvas", { id, property });
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("lastCanvasId", JSON.stringify(data.id));
			},
		}
	);
	return setCanvas;
};
