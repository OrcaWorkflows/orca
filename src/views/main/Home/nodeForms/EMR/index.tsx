import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/Home";

export const EMRValidationSchema = yup.object({
	script_uri: yup.string().required("Script uri is a required field"),
	input_uri: yup.string().required("Input uri is a required field"),
	master_instance_type: yup
		.string()
		.required("Master instance type is a required field"),
	slave_instance_type: yup
		.string()
		.required("Slave instance type is a required field"),
	instance_count: yup
		.number()
		.integer()
		.required("Instance count is a required field"),
});

const EMR = ({
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
		validationSchema: EMRValidationSchema,
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<TextField
							{...formik.getFieldProps("script_uri")}
							error={
								!!(
									formik.getFieldMeta("script_uri").touched &&
									formik.getFieldMeta("script_uri").error
								)
							}
							label="Script URI"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("input_uri")}
							error={
								!!(
									formik.getFieldMeta("input_uri").touched &&
									formik.getFieldMeta("input_uri").error
								)
							}
							label="Input URI"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("master_instance_type")}
							error={
								!!(
									formik.getFieldMeta("master_instance_type").touched &&
									formik.getFieldMeta("master_instance_type").error
								)
							}
							label="Master Instance Type"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("slave_instance_type")}
							error={
								!!(
									formik.getFieldMeta("slave_instance_type").touched &&
									formik.getFieldMeta("slave_instance_type").error
								)
							}
							label="Slave Instance Type"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("instance_count")}
							error={
								!!(
									formik.getFieldMeta("instance_count").touched &&
									formik.getFieldMeta("instance_count").error
								)
							}
							label="Instance Count"
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

export default EMR;
