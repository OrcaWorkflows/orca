import { WorkflowRes } from "views/main/workflows/workflowinterface";

import { Task } from "./interface";

export class NodeConf {
	id: string;

	constructor(id: string) {
		this.id = id;
	}
}

export class S3Conf extends NodeConf {
	bucket_name: string;
	file_path: string;
	file_type: string;

	constructor(
		id: string,
		bucket_name: string,
		file_path: string,
		file_type: string
	) {
		super(id);
		this.bucket_name = bucket_name;
		this.file_path = file_path;
		this.file_type = file_type;
	}
}

export class EMRConf extends NodeConf {
	script_uri: string;
	input_uri: string;
	master_instance_type: string;
	slave_instance_type: string;
	instance_count: string;

	constructor(
		id: string,
		script_uri: string,
		input_uri: string,
		master_instance_type: string,
		slave_instance_type: string,
		instance_count: string
	) {
		super(id);
		this.script_uri = script_uri;
		this.input_uri = input_uri;
		this.master_instance_type = master_instance_type;
		this.slave_instance_type = slave_instance_type;
		this.instance_count = instance_count;
	}
}

export class PubSubConf extends NodeConf {
	project_id: string;
	topic: string;
	topic_action: string;
	constructor(
		id: string,
		project_id: string,
		topic: string,
		topic_action: string
	) {
		super(id);
		this.project_id = project_id;
		this.topic = topic;
		this.topic_action = topic_action;
	}
}

export class BigQueryConf extends NodeConf {
	project_id: string;
	dataset_id: string;
	table_id: string;
	query: string;

	constructor(
		id: string,
		project_id: string,
		dataset_id: string,
		table_id: string,
		query: string
	) {
		super(id);
		this.project_id = project_id;
		this.dataset_id = dataset_id;
		this.table_id = table_id;
		this.query = query;
	}
}

export class KafkaConf extends NodeConf {
	broker_host: string;
	topic_name: string;

	constructor(id: string, broker_host: string, topic_name: string) {
		super(id);
		this.broker_host = broker_host;
		this.topic_name = topic_name;
	}
}

export class ElasticsearchConf extends NodeConf {
	index_name: string;
	host: string;

	constructor(id: string, index_name: string, host: string) {
		super(id);
		this.index_name = index_name;
		this.host = host;
	}
}

export class State {
	static tasks: Array<Task> = [];
	static workflowStatus = "";
	static workflows: Array<WorkflowRes>;
}

export default State;