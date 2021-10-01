import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const SQLValidationSchema = yup.object({
	databasename: yup.string().required("Database Name is a required field"),
	query: yup.string().required("Query is a required field"),
	tablename: yup.string().required("Table Name is a required field"),
});

const SQL = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("databasename") }}
			fieldMetaProps={{ ...formik.getFieldMeta("databasename") }}
			fullWidth
			label="Database Name"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("query") }}
			fieldMetaProps={{ ...formik.getFieldMeta("query") }}
			fullWidth
			label="Query"
			multiline
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("tablename") }}
			fieldMetaProps={{ ...formik.getFieldMeta("tablename") }}
			fullWidth
			label="Table Name"
			required
		/>
	</>
);

export default SQL;
