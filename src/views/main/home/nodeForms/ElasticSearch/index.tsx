import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetCanvas } from "actions/canvasActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/home";

export const ElasticSearchValidationSchema = yup.object({
	host: yup.string().required("Host is a required field"),
	index_name: yup.string().required("Index name is a required field"),
});

const ElasticSearch = ({
	configuredNode,
	handleClose,
	nodes,
	edges,
}: {
	configuredNode: Node;
	handleClose: () => void;
	nodes: Elements;
	edges: Elements;
}): JSX.Element => {
	const { canvasID } = useParams<HomeParams>();

	const initialValues = {
		...configuredNode.data,
	};
	const { isError, mutateAsync } = useSetCanvas();
	const handleSubmit = async (values: typeof initialValues) => {
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
			id: Number(canvasID),
			property: { nodes: newNodes, edges },
		}).then(() => {
			handleClose();
		});
	};

	const formik = useFormik({
		initialValues,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema: ElasticSearchValidationSchema,
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<TextField
							{...formik.getFieldProps("host")}
							error={
								!!(
									formik.getFieldMeta("host").touched &&
									formik.getFieldMeta("host").error
								)
							}
							label="Host"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("index_name")}
							error={
								!!(
									formik.getFieldMeta("index_name").touched &&
									formik.getFieldMeta("index_name").error
								)
							}
							label="Index Name"
							required
						/>
					</Grid>
					<Grid item>
						<Button
							disabled={formik.isSubmitting || !formik.isValid}
							type="submit"
						>
							Save
						</Button>
					</Grid>
				</Grid>
			</form>

			{isError && <ServerError />}
		</>
	);
};

export default ElasticSearch;
