export interface Metadata {
    creationTimestamp:string;
    generateName:string;
    generation: number;
    labels: any; // To be implemented
    managedFields: any; // To be implemented
    name: string;
    namespace: string;
    resourceVersion: string;
    selfLink: string;
    uid: string;
}

export interface Workflow {
    metadata: Metadata;
    spec: any; // To be implemented
    status: any; // To be implemented
}

export interface Workflows {
    items: Array<Workflow>;
}