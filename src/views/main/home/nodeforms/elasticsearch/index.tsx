import { forwardRef, useImperativeHandle, useState } from "react";

import { Formik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import {
	NotificationContainer,
	NotificationManager,
} from "react-notifications";

import { setCanvas } from "../../../../../actions/canvas_actions";
import { notificationTimeoutMillis } from "../../../../../config";
import { ElasticsearchConf } from "../../../../data/state";
import DisplayForm from "./displayawsform";

const ESForm = forwardRef(
	(
		props: {
			nodes: Elements;
			setNodes: (value: Elements | ((prevVar: Elements) => Elements)) => void;
			edges: Elements;
		},
		ref
	) => {
		const [ESFormValues, setESFormValues] = useState({});

		const getESFormValues = () => {
			return ESFormValues;
		};

		useImperativeHandle(ref, () => {
			return {
				getFormValues: getESFormValues,
			};
		});

		const initialValues = {
			host: "",
			index_name: "",
		};

		const setInitialValues = () => {
			const currentNodeClick = localStorage.getItem("currentNodeClick");
			const index = props.nodes.findIndex(
				(node: FlowElement) => (node as Node).id === currentNodeClick
			);
			if (
				Object.prototype.hasOwnProperty.call(props.nodes[index] as Node, "conf")
			) {
				const nodeConf: ElasticsearchConf = (props.nodes[index] as Node).data
					.conf;
				initialValues.host = nodeConf.host;
				initialValues.index_name = nodeConf.index_name;
			}
			return initialValues;
		};

		const handleSubmit = (values: any, actions: any) => {
			setESFormValues(JSON.parse(JSON.stringify(values, null, 2)));
			const currentNodeClick = localStorage.getItem(
				"currentNodeClick"
			) as string;
			const index = props.nodes.findIndex(
				(node: FlowElement) => (node as Node).id === currentNodeClick
			);
			const newElasticsearchConf: ElasticsearchConf = {
				id: currentNodeClick,
				host: values.host,
				index_name: values.index_name,
			};
			actions.setSubmitting(false);
			const node: FlowElement = props.nodes[index];
			const newNode = {
				...node,
				data: { ...node.data, conf: newElasticsearchConf },
			};
			const newNodes = [...props.nodes];
			newNodes[index] = newNode;
			props.setNodes(newNodes);
			setCanvas(newNodes, props.edges);
			NotificationManager.success(
				"Successfully Saved Configurations",
				"Success",
				notificationTimeoutMillis
			);
		};

		return (
			<div className={"container"}>
				<NotificationContainer />
				<label className={"form-label"}>Elasticsearch Configurations</label>
				<Formik
					initialValues={setInitialValues()}
					onSubmit={handleSubmit}
					render={DisplayForm}
				/>
			</div>
		);
	}
);

ESForm.displayName = "ESForm";

export default ESForm;
