import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/Home";

export const DynamoDBValidationSchema = yup.object({
	table_name: yup.string().required("Table name is a required field"),
	batch_size: yup.number().integer().required("Batch size is a required field"),
});

const DynamoDB = ({
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
	const { workflowID } = useParams<HomeParams>();

	const initialValues = {
		...configuredNode.data,
	};

	const { isError, mutateAsync } = useSetWorkflow();
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
			id: Number(workflowID),
			property: { nodes: newNodes, edges },
		}).then(() => {
			handleClose();
		});
	};

	const formik = useFormik({
		initialValues,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema: DynamoDBValidationSchema,
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<TextField
							{...formik.getFieldProps("table_name")}
							error={
								!!(
									formik.getFieldMeta("table_name").touched &&
									formik.getFieldMeta("table_name").error
								)
							}
							label="Table Name"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("batch_size")}
							error={
								!!(
									formik.getFieldMeta("batch_size").touched &&
									formik.getFieldMeta("batch_size").error
								)
							}
							label="Batch Size"
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

export default DynamoDB;
