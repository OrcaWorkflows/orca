import { Button, Grid, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetCanvas } from "actions/canvasActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/home/DnDFlow";

const BigQueryValidationSchema = yup.object({
	project_id: yup.string().required(),
	dataset_id: yup.string().required(),
	table_id: yup.string().required(),
	query: yup.string().required(),
});

export type Values = {
	project_id: string;
	dataset_id: string;
	table_id: string;
	query: string;
};

const BigQuery = ({
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
		project_id: configuredNode.data.project_id ?? "akis-295110",
		dataset_id: configuredNode.data.dataset_id ?? "",
		table_id: configuredNode.data.table_id ?? "",
		query: configuredNode.data.query ?? "",
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
				validationSchema={BigQueryValidationSchema}
			>
				{({ isSubmitting, isValid }) => (
					<Form>
						<Grid container direction="column" alignItems="center" spacing={2}>
							<Grid item>
								<Field name="project_id">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Project ID"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="dataset_id">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Dataset ID"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="table_id">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Table ID"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="query">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Query"
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

export default BigQuery;
