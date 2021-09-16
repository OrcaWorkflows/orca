import { Button, Grid, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";

export const SQLValidationSchema = yup.object({
	host: yup.string().required("Host is a required field"),
	port: yup.number().integer().required("Port is a required field"),
	username: yup.string().required("Username is a required field"),
	password: yup.string().required("Password is a required field"),
	databasename: yup.string().required("Database name is a required field"),
	query: yup.string().required("Query is a required field"),
	tablename: yup.string().required("Table name is a required field"),
});

const SQL = ({
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
		validationSchema: SQLValidationSchema,
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
							{...formik.getFieldProps("username")}
							error={
								!!(
									formik.getFieldMeta("username").touched &&
									formik.getFieldMeta("username").error
								)
							}
							label="User Name"
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
							type="password"
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("databasename")}
							error={
								!!(
									formik.getFieldMeta("databasename").touched &&
									formik.getFieldMeta("databasename").error
								)
							}
							label="Database Name"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("query")}
							error={
								!!(
									formik.getFieldMeta("query").touched &&
									formik.getFieldMeta("query").error
								)
							}
							label="Query"
							multiline
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							{...formik.getFieldProps("tablename")}
							error={
								!!(
									formik.getFieldMeta("tablename").touched &&
									formik.getFieldMeta("tablename").error
								)
							}
							label="Table Name"
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

export default SQL;
