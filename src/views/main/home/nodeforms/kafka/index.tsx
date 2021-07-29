import { forwardRef, useImperativeHandle, useState } from "react";

import { Formik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import {
	NotificationContainer,
	NotificationManager,
} from "react-notifications";

import { setCanvas } from "../../../../../actions/canvas_actions";
import { notificationTimeoutMillis } from "../../../../../config";
import { KafkaConf } from "../../../../data/state";
import DisplayForm from "./displayawsform";

const KafkaForm = forwardRef(
	(
		props: {
			nodes: Elements;
			setNodes: (value: Elements | ((prevVar: Elements) => Elements)) => void;
			edges: Elements;
		},
		ref
	) => {
		const [KafkaFormValues, setKafkaFormValues] = useState({});

		const getKafkaFormValues = () => {
			return KafkaFormValues;
		};

		useImperativeHandle(ref, () => {
			return {
				getFormValues: getKafkaFormValues,
			};
		});

		const initialValues = {
			topic_name: "",
			broker_host: "",
		};

		const setInitialValues = () => {
			const currentNodeClick = localStorage.getItem("currentNodeClick");
			const index = props.nodes.findIndex(
				(node: FlowElement) => (node as Node).id === currentNodeClick
			);
			if (
				Object.prototype.hasOwnProperty.call(
					(props.nodes[index] as Node).data,
					"conf"
				)
			) {
				const nodeConf: KafkaConf = (props.nodes[index] as Node).data.conf;
				initialValues.topic_name = nodeConf.topic_name;
				initialValues.broker_host = nodeConf.broker_host;
			}
			return initialValues;
		};

		const handleSubmit = (values: any, actions: any) => {
			setKafkaFormValues(JSON.parse(JSON.stringify(values, null, 2)));
			const currentNodeClick = localStorage.getItem(
				"currentNodeClick"
			) as string;
			const index = props.nodes.findIndex(
				(node: FlowElement) => (node as Node).id === currentNodeClick
			);
			const newKafkaConf: KafkaConf = {
				id: currentNodeClick,
				broker_host: values.broker_host,
				topic_name: values.topic_name,
			};
			actions.setSubmitting(false);
			const node: FlowElement = props.nodes[index];
			const newNode = { ...node, data: { ...node.data, conf: newKafkaConf } };
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
				<label className={"form-label"}>Kafka Configurations</label>
				<Formik
					initialValues={setInitialValues()}
					onSubmit={handleSubmit}
					render={DisplayForm}
				/>
			</div>
		);
	}
);
KafkaForm.displayName = "KafkaForm";

export default KafkaForm;
