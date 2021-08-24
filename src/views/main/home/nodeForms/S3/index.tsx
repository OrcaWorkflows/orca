import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useSetCanvas } from "actions/canvasActions";
import { ServerError } from "components";
import { HomeParams } from "views/main/home";

export const S3ValidationSchema = yup.object({
	bucket_name: yup.string().required("Bucket name is a required field"),
	file_path: yup.string().required("File path is a required field"),
	file_type: yup.string().required("File type is a required field"),
});

const S3 = ({
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
		validationSchema: S3ValidationSchema,
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<TextField
							{...formik.getFieldProps("bucket_name")}
							error={
								!!(
									formik.getFieldMeta("bucket_name").touched &&
									formik.getFieldMeta("bucket_name").error
								)
							}
							label="Bucket Name"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("file_path")}
							error={
								!!(
									formik.getFieldMeta("file_path").touched &&
									formik.getFieldMeta("file_path").error
								)
							}
							label="File Path"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("file_type")}
							error={
								!!(
									formik.getFieldMeta("file_type").touched &&
									formik.getFieldMeta("file_type").error
								)
							}
							label="File Type"
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

export default S3;
