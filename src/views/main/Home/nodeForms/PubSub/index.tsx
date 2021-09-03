import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";

export const PubSubValidationSchema = yup.object({
	project_id: yup.string().required("Project id is a required field"),
	topic: yup.string().required("Topic is a required field"),
	topic_action: yup.string().required("Topic action is a required field"),
});

const PubSub = ({
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
			property: { nodes: newNodes, edges },
		}).then(() => {
			handleClose();
		});
	};

	const formik = useFormik({
		initialValues,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema: PubSubValidationSchema,
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<TextField
							{...formik.getFieldProps("project_id")}
							error={
								!!(
									formik.getFieldMeta("project_id").touched &&
									formik.getFieldMeta("project_id").error
								)
							}
							label="Project ID"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("topic")}
							error={
								!!(
									formik.getFieldMeta("topic").touched &&
									formik.getFieldMeta("topic").error
								)
							}
							label="Topic"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("topic_action")}
							error={
								!!(
									formik.getFieldMeta("topic_action").touched &&
									formik.getFieldMeta("topic_action").error
								)
							}
							label="Topic Action"
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

export default PubSub;
