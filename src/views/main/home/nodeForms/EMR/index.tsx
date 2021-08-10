import { Button, Grid, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetCanvas } from "actions/canvasActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/home/DnDFlow";

const EMRValidationSchema = yup.object({
	script_uri: yup.string().required(),
	input_uri: yup.string().required(),
	master_instance_type: yup.string().required(),
	slave_instance_type: yup.string().required(),
	instance_count: yup.number().integer().required(),
});
export type Values = {
	script_uri: string;
	input_uri: string;
	master_instance_type: string;
	slave_instance_type: string;
	instance_count: number;
};

const EMR = ({
	configuredNode,
	handleClose,
	nodes,
	setNodes,
	edges,
}: {
	configuredNode: Node;
	handleClose: () => void;
	nodes: Elements;
	setNodes: (value: Elements | ((prevVar: Elements) => Elements)) => void;
	edges: Elements;
}): JSX.Element => {
	const { canvasId } = useParams<HomeParams>();
	const initialValues = {
		script_uri: configuredNode.data.script_uri ?? "",
		input_uri: configuredNode.data.input_uri ?? "",
		master_instance_type:
			configuredNode.data.master_instance_type ?? "m5.xlarge",
		slave_instance_type: configuredNode.data.slave_instance_type ?? "m5.xlarge",
		instance_count: configuredNode.data.instance_count ?? 3,
	};

	const { isError, mutateAsync } = useSetCanvas();
	const handleSubmit = async (values: Values) => {
		const indexToUpdate = nodes.findIndex(
			(node: FlowElement) => (node as Node).id === configuredNode.id
		);
		const node = nodes[indexToUpdate];
		const newNode = {
			...node,
			data: { ...nodes[indexToUpdate].data, ...values },
		};
		const newNodes = [...nodes];
		newNodes[indexToUpdate] = newNode;
		return mutateAsync({
			id: Number(canvasId),
			property: { nodes: newNodes, edges },
		}).then(() => {
			setNodes(newNodes);
			handleClose();
		});
	};

	return (
		<>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnMount
				validationSchema={EMRValidationSchema}
			>
				{({ isSubmitting, isValid }) => (
					<Form>
						<Grid container direction="column" alignItems="center" spacing={2}>
							<Grid item>
								<Field name="script_uri">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Script URI"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="input_uri">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Input URI"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="master_instance_type">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Master Instance Type"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="slave_instance_type">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Slave Instance Type"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="instance_count">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Instance Count"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Button disabled={isSubmitting || !isValid} type="submit">
									Save
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			{isError && <ServerError />}
		</>
	);
};

export default EMR;
