export interface Name {
	name: string;
}
export interface TemplateRef extends Name {
	template: string;
}

export interface EnvironmentVar extends Name {
	value: string;
}

export interface Parameters {
	parameters: Array<EnvironmentVar>;
}

export interface Task extends Name {
	templateRef: TemplateRef;
	arguments: Parameters;
	dependencies: Array<string>;
}

export interface Workflow extends Name {
	tasks: Array<Task>;
}
