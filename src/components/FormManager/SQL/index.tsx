import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const SQLValidationSchema = yup.object({
	databasename: yup.string().required(),
	query: yup.string(),
	tablename: yup.string(),
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
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("tablename") }}
			fieldMetaProps={{ ...formik.getFieldMeta("tablename") }}
			fullWidth
			label="Table Name"
		/>
	</>
);

export default SQL;
