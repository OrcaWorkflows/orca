import { Edge, Elements, Node } from "react-flow-renderer";

import { Task, Workflow } from "views/main/home/workflow/interfaces";
import * as parameterNames from "views/main/home/workflow/nodeWorkflowParameterNames";

export function addWorkflowParametersToTask(
	task: Task,
	sourceNode: Node,
	targetNode: Node
): void {
	for (const parameter in sourceNode.data) {
		if (
			Object.prototype.hasOwnProperty.call(sourceNode.data, parameter) &&
			sourceNode.type
		) {
			const platform =
				parameterNames[sourceNode.type as keyof typeof parameterNames];
			task.arguments.parameters.push({
				name: platform[parameter as keyof typeof platform],
				value: sourceNode.data[parameter],
			});
		}
	}
	for (const parameter in targetNode.data) {
		if (
			Object.prototype.hasOwnProperty.call(targetNode.data, parameter) &&
			targetNode.type
		) {
			const platform =
				parameterNames[targetNode.type as keyof typeof parameterNames];
			task.arguments.parameters.push({
				name: platform[parameter as keyof typeof platform],
				value: targetNode.data[parameter],
			});
		}
	}
}

export function createTaskForEdge(
	sourceNode: Node,
	targetNode: Node,
	dependencies: string[]
): Task {
	const task = {
		name: sourceNode.id + "-" + targetNode.id,
		dependencies: dependencies,
		templateRef: {
			name: "orca-operators",
			template: "orca-operators",
		},
		arguments: {
			parameters: [
				{
					name: "OPERATOR_SOURCE",
					value: (sourceNode.type as string).toLowerCase(),
				},
				{
					name: "OPERATOR_TARGET",
					value: (targetNode.type as string).toLowerCase(),
				},
			],
		},
	};

	addWorkflowParametersToTask(task, sourceNode, targetNode);
	return task;
}

const createWorkFlow = (
	canvasID: number,
	nodes: Elements,
	edges: Elements,
	workflowName: string
): Workflow => {
	const workflow: Workflow = {
		canvasID,
		name: workflowName,
		tasks: [],
	};

	for (const edge of edges) {
		const sourceNode = nodes.find(
			(node) => (node as Node).id === (edge as Edge).source
		);
		const targetNode = nodes.find(
			(node) => (node as Node).id === (edge as Edge).target
		);

		// Find deps of the source node of the edge we are creating the task for
		const dependencies: Array<string> = [];
		edges.forEach((e) => {
			if ((edge as Edge).source === (e as Edge).target) {
				dependencies.push((e as Edge).source + "-" + (e as Edge).target);
			}
		});

		if (sourceNode && targetNode) {
			const task = createTaskForEdge(
				sourceNode as Node,
				targetNode as Node,
				dependencies
			);
			workflow.tasks.push(task);
		}
	}
	return workflow;
};

export default createWorkFlow;
