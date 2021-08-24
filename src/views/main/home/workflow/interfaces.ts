// Request
interface Name {
	name: string;
}
interface TemplateRef extends Name {
	template: string;
}

interface EnvironmentVar extends Name {
	value: string;
}

interface Parameters {
	parameters: Array<EnvironmentVar>;
}

export interface Task extends Name {
	templateRef: TemplateRef;
	arguments: Parameters;
	dependencies: Array<string>;
}

export interface Workflow {
	canvasID: number;
	name: string | null;
	tasks: Array<Task>;
}

// Response
export interface Metadata {
	creationTimestamp: string;
	generateName: string;
	generation: number;
	labels: any; // To be implemented
	managedFields: any; // To be implemented
	name: string;
	namespace: string;
	resourceVersion: string;
	selfLink: string;
	uid: string;
}

export interface WorkflowRes {
	metadata: Metadata;
	spec: any; // To be implemented
	status: any; // To be implemented
}

export interface WorkflowMetadataRes {
	resourceVersion: string;
}

export interface WorkflowListRes {
	metadata: WorkflowMetadataRes;
	items: Array<WorkflowRes>;
}
