import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const SQLValidationSchema = yup.object({
	databasename: yup.string().required("Database name is a required field"),
	query: yup.string().required("Query is a required field"),
	tablename: yup.string().required("Table name is a required field"),
});

const SQL = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("databasename")}
			error={
				!!(
					formik.getFieldMeta("databasename").touched &&
					formik.getFieldMeta("databasename").error
				)
			}
			fullWidth
			label="Database Name"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("query")}
			error={
				!!(
					formik.getFieldMeta("query").touched &&
					formik.getFieldMeta("query").error
				)
			}
			fullWidth
			label="Query"
			margin="dense"
			multiline
			required
		/>
		<TextField
			{...formik.getFieldProps("tablename")}
			error={
				!!(
					formik.getFieldMeta("tablename").touched &&
					formik.getFieldMeta("tablename").error
				)
			}
			fullWidth
			label="Table Name"
			margin="dense"
			required
		/>
	</>
);

export default SQL;
