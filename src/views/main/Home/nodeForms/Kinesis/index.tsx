import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";

export const KinesisValidationSchema = yup.object({
	stream_name: yup.string().required("Stream name is a required field"),
});

const Kinesis = ({
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
		validationSchema: KinesisValidationSchema,
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<TextField
							{...formik.getFieldProps("stream_name")}
							error={
								!!(
									formik.getFieldMeta("stream_name").touched &&
									formik.getFieldMeta("stream_name").error
								)
							}
							label="Stream Name"
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

export default Kinesis;
Kinesis;
