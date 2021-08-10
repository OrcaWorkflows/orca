import { Button, Grid, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetCanvas } from "actions/canvasActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/home/DnDFlow";

const ElasticSearchValidationSchema = yup.object({
	host: yup.string().required(),
	index_name: yup.string().required(),
});
export type Values = {
	host: string;
	index_name: string;
};

const ElasticSearch = ({
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
		host: configuredNode.data.host ?? "",
		index_name: configuredNode.data.index_name ?? "",
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
				validationSchema={ElasticSearchValidationSchema}
			>
				{({ isSubmitting, isValid }) => (
					<Form>
						<Grid container direction="column" alignItems="center" spacing={2}>
							<Grid item>
								<Field name="host">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="Bucket Name"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="index_name">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="File Path"
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

export default ElasticSearch;
