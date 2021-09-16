import { Elements } from "react-flow-renderer";

interface IName {
	name: string;
}
interface ITemplateRef extends IName {
	template: string;
}

interface IEnvironmentVar extends IName {
	value: string;
}

interface IParameters {
	parameters: Array<IEnvironmentVar>;
}

export interface ITask extends IName {
	templateRef: ITemplateRef;
	arguments: IParameters;
	dependencies: Array<string>;
}

export interface IArgoWorkflow {
	workflowID: number;
	name: string;
	tasks: Array<ITask>;
}

export interface IWorkflow {
	argoWorkflowName: string;
	createdAt: string;
	id: number;
	name: string;
	property: { nodes: Elements; edges: Elements };
	updatedAt: string;
	submitted: boolean;
}
