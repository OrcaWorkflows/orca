import { Dispatch, SetStateAction } from "react";

import { AxiosResponse } from "axios";
import { Elements } from "react-flow-renderer";
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseMutationResult,
	useInfiniteQuery,
	UseInfiniteQueryResult,
	UseQueryResult,
} from "react-query";
import { useParams, useHistory } from "react-router-dom";

import { IArgoWorkflow, IWorkflow } from "interfaces";
import { axios } from "utils";
import { HomeParams } from "views/main/Home";

export function useGetWorkflow(): UseQueryResult<IWorkflow> {
	const { workflowID } = useParams<HomeParams>();

	const workflow = useQuery(
		["workflow", workflowID],
		async () => {
			const { data } = await axios({
				method: "get",
				url: process.env.REACT_APP_API + `/api/workflow/${workflowID}`,
			});
			return data;
		},
		{
			enabled: Boolean(workflowID),
		}
	);
	return workflow;
}

type Values = {
	id?: number;
	name?: string;
	property?: { nodes: Elements; edges: Elements };
};
export const useSetWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const history = useHistory();
	const { workflowID } = useParams<HomeParams>();
	const queryClient = useQueryClient();

	const argoWorkflowName = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	])?.argoWorkflowName; // Required by endpoint to keep the same argoWorkflowName for a given workflow
	const currentWorkflowName = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	])?.name;
	const currentProperty = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	])?.property ?? { nodes: [], edges: [] }; // Required by endpoint

	const setWorkflow = useMutation(
		async ({
			id = Number(workflowID),
			name = currentWorkflowName,
			property = currentProperty,
		}: Values) => {
			const { data } = await axios({
				method: "post",
				url: process.env.REACT_APP_API + "/api/workflow",
				data: {
					argoWorkflowName,
					id,
					name,
					property,
				},
			});
			return data;
		},
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(["workflow", `${data.id}`]);
				if (!workflowID) history.replace(`/home/${data.id}`); // This setWorkflow just created a new workflow so redirect to it
			},
		}
	);
	return setWorkflow;
};

export const useDeleteWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ id: number },
	unknown
> => {
	const queryClient = useQueryClient();

	const deleteWorkflow = useMutation(
		async ({ id }: { id: number }) => {
			const { data } = await axios({
				method: "delete",
				url: process.env.REACT_APP_API + `/api/workflow/${id}`,
			});
			return data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["workflows"]);
			},
		}
	);
	return deleteWorkflow;
};

export function useInfiniteGetWorkFlows({
	rowsPerPage,
}: {
	rowsPerPage: number;
}): UseInfiniteQueryResult<{ totalCount: number; workflows: IWorkflow[] }> {
	const workflows = useInfiniteQuery(
		"workflows",
		async ({ pageParam = 0 }) => {
			const { data } = await axios({
				method: "get",
				url: process.env.REACT_APP_API + "/api/workflow",
				params: {
					pageNumber: pageParam,
					pageSize: rowsPerPage,
				},
			});
			return { totalCount: data.totalCount, workflows: data.workflows };
		},
		{
			getNextPageParam: (lastPage, pages) => {
				let fetchedWorkflowsCount = 0;
				for (const page of pages) {
					fetchedWorkflowsCount += page.workflows.length;
				}
				return fetchedWorkflowsCount < lastPage.totalCount
					? pages.length
					: undefined;
			},
		}
	);
	return workflows;
}

export function usePaginatedGetWorkflows({
	page,
	rowsPerPage,
}: {
	page: number;
	rowsPerPage: number;
}): UseQueryResult<{ totalCount: number; workflows: IWorkflow[] }> {
	const queryClient = useQueryClient();

	const workflows = useQuery(
		["workflows", page, rowsPerPage],
		async () => {
			const { data } = await axios({
				method: "get",
				url: process.env.REACT_APP_API + "/api/workflow",
				params: {
					pageNumber: page,
					pageSize: rowsPerPage,
				},
			});
			return data;
		},
		{
			keepPreviousData: true,
			staleTime: 5000,
			onSuccess: (data) => {
				if (rowsPerPage * (page + 1) < data.totalCount) {
					queryClient.prefetchQuery(
						["workflows", page + 1, rowsPerPage],
						async () => {
							const { data } = await axios({
								method: "get",
								url: process.env.REACT_APP_API + "/api/workflow",
								params: {
									pageNumber: page + 1,
									pageSize: rowsPerPage,
								},
							});
							return data;
						}
					);
				}
			},
		}
	);
	return workflows;
}

export const useSubmitWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflow: IArgoWorkflow },
	unknown
> => {
	const { workflowID } = useParams<HomeParams>();
	const queryClient = useQueryClient();

	const submitWorkflow = useMutation(
		async ({ workflow }: { workflow: IArgoWorkflow }) => {
			const { data } = await axios({
				method: "post",
				url: process.env.REACT_APP_API + "/api/workflow/submit",
				data: {
					...workflow,
				},
			});
			return data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["workflow", workflowID]);
			},
		}
	);
	return submitWorkflow;
};

export const useSuspendWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string },
	unknown
> => {
	const suspendWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string }) => {
			const { data } = await axios({
				method: "put",
				url:
					process.env.REACT_APP_API +
					`/api/workflow/${argoWorkflowName}/suspend`,
			});
			return data;
		}
	);
	return suspendWorkflow;
};

export const useResumeWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string },
	unknown
> => {
	const resumeWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string }) => {
			const { data } = await axios({
				method: "put",
				url:
					process.env.REACT_APP_API +
					`/api/workflow/${argoWorkflowName}/resume`,
			});
			return data;
		}
	);
	return resumeWorkflow;
};

export const useStopWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string },
	unknown
> => {
	const stopWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string }) => {
			const { data } = await axios({
				method: "put",
				url:
					process.env.REACT_APP_API + `/api/workflow/${argoWorkflowName}/stop`,
			});
			return data;
		}
	);
	return stopWorkflow;
};

export const useTerminateWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string },
	unknown
> => {
	const terminateWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string }) => {
			const { data } = await axios({
				method: "put",
				url:
					process.env.REACT_APP_API +
					`/api/workflow/${argoWorkflowName}/terminate`,
			});
			return data;
		}
	);
	return terminateWorkflow;
};

type infoType = "metadata" | "spec" | "status";

export const useInfoOfWorkflow = (
	{
		argoWorkflowName,
		infoType,
		enqueuedEdgeStatus,
		setEnqueuedEdgeStatus,
	}: {
		argoWorkflowName: string;
		infoType: infoType;
		enqueuedEdgeStatus: {
			displayName: string;
			isSeen: boolean;
			phase: string;
		}[];
		setEnqueuedEdgeStatus: Dispatch<
			SetStateAction<{ displayName: string; isSeen: boolean; phase: string }[]>
		>;
	},
	enabled: boolean
): UseQueryResult<any> => {
	const infoOfWorkflow = useQuery(
		[`workflow/info/${infoType}`, argoWorkflowName],
		async () => {
			const { data } = await axios({
				method: "get",
				url:
					process.env.REACT_APP_API +
					`/api/workflow/${argoWorkflowName}/${infoType}`,
			});
			return data;
		},
		{
			refetchInterval: 4000,
			onSuccess: (data): void => {
				const nodes = Object.values<any>(data?.nodes ?? {});
				// "nodes" actually stands for the edges, it's just how endpoint indicates them
				nodes
					.filter((node) => node.type === "Pod")
					.map((node: any) => {
						if (
							node &&
							!enqueuedEdgeStatus?.some(
								(edge) => edge.displayName === node?.displayName
							) &&
							(node.phase === "Succeeded" || node.phase === "Failed")
						) {
							if (setEnqueuedEdgeStatus)
								setEnqueuedEdgeStatus((prevEnqueuedNodes) => [
									...prevEnqueuedNodes,
									{
										displayName: node.displayName,
										isSeen: false,
										phase: node.phase,
									},
								]);
						}
					});
			},
			enabled,
		}
	);
	return infoOfWorkflow;
};

export const useLogOfPod = (
	{
		argoWorkflowName,
		podName,
	}: {
		argoWorkflowName: string;
		podName: string | undefined;
	},
	enabled: boolean
): UseQueryResult<any> => {
	const logOfPod = useQuery(
		[`workflow/logs/${podName}`, argoWorkflowName],
		async () => {
			const { data } = await axios({
				method: "get",
				url:
					process.env.REACT_APP_API +
					`/api/workflow/${argoWorkflowName}/${podName}/log`,
			});
			return data;
		},
		{ refetchInterval: 4000, enabled }
	);
	return logOfPod;
};
