import { AxiosResponse } from "axios";
import { useMutation, useQuery, UseMutationResult } from "react-query";

import { axios } from "utils";
import {
	Workflow,
	WorkflowMetadataRes,
	WorkflowRes,
} from "views/main/home/workflow/interfaces";

export const useSubmitWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflow: Workflow },
	unknown
> => {
	// Submit causes new workflows to generate each time from the same canvas (contradicts with 1 to 1 rel.)
	const submitWorkflow = useMutation(
		async ({ workflow }: { workflow: Workflow }) => {
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
	{ workflowName: string },
	unknown
> => {
	const suspendWorkflow = useMutation(
		async ({ workflowName }: { workflowName: string }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${workflowName}/suspend`,
				{
					workflowName,
				}
			);
			return data;
		}
	);
	return suspendWorkflow;
};

export const useResumeWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflowName: string },
	unknown
> => {
	const resumeWorkflow = useMutation(
		async ({ workflowName }: { workflowName: string }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${workflowName}/resume`,
				{
					workflowName,
				}
			);
			return data;
		}
	);
	return resumeWorkflow;
};

export const useStopWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflowName: string },
	unknown
> => {
	const stopWorkflow = useMutation(
		async ({ workflowName }: { workflowName: string }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${workflowName}/stop`,
				{
					workflowName,
				}
			);
			return data;
		}
	);
	return stopWorkflow;
};

export const useTerminateWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflowName: string },
	unknown
> => {
	const terminateWorkflow = useMutation(
		async ({ workflowName }: { workflowName: string }) => {
			const { data } = await axios(
				"put",
				`/api/workflow/argo/${workflowName}/terminate`,
				{
					workflowName,
				}
			);
			return data;
		}
	);
	return terminateWorkflow;
};

export const useDeleteWorkflow = (): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflowName: string },
	unknown
> => {
	const deleteWorkflow = useMutation(
		async ({ workflowName }: { workflowName: string }) => {
			const { data } = await axios(
				"delete",
				`/api/workflow/argo/${workflowName}`,
				{
					workflowName,
				}
			);
			return data;
		}
	);
	return deleteWorkflow;
};

export function useGetWorkflows(): {
	isError: boolean;
	isFetching: boolean;
	isLoading: boolean;
	metadata: WorkflowMetadataRes;
	items: WorkflowRes[];
} {
	const workflows = useQuery(["workflows"], async () => {
		const { data } = await axios("get", "/api/workflow");
		return data;
	});

	return {
		isError: workflows.isError,
		isFetching: workflows.isFetching,
		isLoading: workflows.isLoading,
		metadata: workflows.data?.metadata,
		items: workflows.data?.items,
	};
}

// This may come with getWorkflows
export function useGetCanvasByWorkflowID(): UseMutationResult<
	AxiosResponse,
	unknown,
	{ workflowName: string },
	unknown
> {
	const getCanvasByWorkflowID = useMutation(
		async ({ workflowName }: { workflowName: string }) => {
			const { data } = await axios(
				"get",
				`/api/canvas/workflow/${workflowName}`,
				{
					workflowName,
				}
			);
			return data;
		}
	);
	return getCanvasByWorkflowID;
}

// export function getWorkflowStatus(workflowName: string) {
// 	axios
// 		.get(
// 			API +
// 				API_PATH +
// 				WORKFLOW +
// 				DIVIDER +
// 				SERVICE_ACCOUNT_NAME +
// 				DIVIDER +
// 				workflowName,
// 			{}
// 		)
// 		.then((response) => {
// 			State.workflowStatus =
// 				response.data.metadata.labels["workflows.argoproj.io/phase"];
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 		});
// }
