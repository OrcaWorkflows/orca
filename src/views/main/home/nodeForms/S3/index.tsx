import { Button, Grid, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetCanvas } from "actions/canvasActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/home/DnDFlow";

const S3ValidationSchema = yup.object({
	bucket_name: yup.string().required(),
	file_path: yup.string().required(),
	file_type: yup.string().required(),
});
export type Values = {
	bucket_name: string;
	file_path: string;
	file_type: string;
};

const S3 = ({
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
		bucket_name: configuredNode.data.bucket_name ?? "",
		file_path: configuredNode.data.file_path ?? "",
		file_type: configuredNode.data.file_type ?? "",
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
				validationSchema={S3ValidationSchema}
			>
				{({ isSubmitting, isValid }) => (
					<Form>
						<Grid container direction="column" alignItems="center" spacing={2}>
							<Grid item>
								<Field name="bucket_name">
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
								<Field name="file_path">
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
								<Field name="file_type">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												label="File Type"
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

export default S3;
