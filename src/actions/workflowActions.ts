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
import { useParams } from "react-router";

import { IArgoWorkflow, IWorkflow } from "interfaces";
import { axios } from "utils";
import { HomeParams } from "views/main/Home";

export function useGetWorkflow(enabled: boolean): UseQueryResult<IWorkflow> {
	const { workflowID } = useParams<HomeParams>();

	const workflow = useQuery(
		["workflow", workflowID],
		async () => {
			const { data } = await axios("get", `/api/workflow/${workflowID}`);
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("lastWorkflowID", JSON.stringify(data.id));
			},
			enabled,
		}
	);
	return workflow;
}

type Values = {
	id?: number;
	name?: string | null;
	property?: { nodes: Elements; edges: Elements };
};
export const useSetWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	Values,
	unknown
> => {
	const { workflowID } = useParams<HomeParams>();
	const queryClient = useQueryClient();

	const currentWorkflowName = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	])?.name;
	const currentProperty = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	])?.property;

	const setWorkflow = useMutation(
		async ({
			id = Number(workflowID),
			name = currentWorkflowName,
			property = currentProperty,
		}: Values) => {
			const { data } = await axios("post", "/api/workflow", {
				id,
				name,
				property,
			});
			return data;
		},
		{
			onSuccess: (data) => {
				localStorage.setItem("lastWorkflowID", JSON.stringify(data.id));
				queryClient.invalidateQueries(["workflow", `${data.id}`]);
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
			const { data } = await axios("delete", `/api/workflow/${id}`);
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
			const { data } = await axios("get", "/api/workflow", undefined, {
				pageNumber: pageParam,
				pageSize: rowsPerPage,
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
			const { data } = await axios("get", "/api/workflow", undefined, {
				pageNumber: page,
				pageSize: rowsPerPage,
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
							const { data } = await axios("get", "/api/workflow", undefined, {
								pageNumber: page + 1,
								pageSize: rowsPerPage,
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
	const submitWorkflow = useMutation(
		async ({ workflow }: { workflow: IArgoWorkflow }) => {
			const { data } = await axios("post", "/api/workflow/submit", {
				...workflow,
			});
			return data;
		}
	);
	return submitWorkflow;
};

export const useSuspendWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string | null },
	unknown
> => {
	const suspendWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string | null }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${argoWorkflowName}/suspend`
			);
			return data;
		}
	);
	return suspendWorkflow;
};

export const useResumeWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string | null },
	unknown
> => {
	const resumeWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string | null }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${argoWorkflowName}/resume`
			);
			return data;
		}
	);
	return resumeWorkflow;
};

export const useStopWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string | null },
	unknown
> => {
	const stopWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string | null }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${argoWorkflowName}/stop`
			);
			return data;
		}
	);
	return stopWorkflow;
};

export const useTerminateWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ argoWorkflowName: string | null },
	unknown
> => {
	const terminateWorkflow = useMutation(
		async ({ argoWorkflowName }: { argoWorkflowName: string | null }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${argoWorkflowName}/terminate`
			);
			return data;
		}
	);
	return terminateWorkflow;
};
