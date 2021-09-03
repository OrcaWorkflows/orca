import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";

export const RedisValidationSchema = yup.object({
	host: yup.string().required("Host is a required field"),
	port: yup.number().integer().required("Port is a required field"),
	database: yup.string().required("Database is a required field"),
	password: yup.string().required("Password is a required field"),
});

const Redis = ({
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
		validationSchema: RedisValidationSchema,
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
							{...formik.getFieldProps("port")}
							error={
								!!(
									formik.getFieldMeta("port").touched &&
									formik.getFieldMeta("port").error
								)
							}
							label="Port"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("database")}
							error={
								!!(
									formik.getFieldMeta("database").touched &&
									formik.getFieldMeta("database").error
								)
							}
							label="Database"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("password")}
							error={
								!!(
									formik.getFieldMeta("password").touched &&
									formik.getFieldMeta("password").error
								)
							}
							label="Password"
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

export default Redis;
