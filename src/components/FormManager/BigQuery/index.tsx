import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const BigQueryValidationSchema = yup.object({
	project_id: yup.string().required("Project ID is a required field"),
	dataset_id: yup.string().required("Dataset ID is a required field"),
	table_id: yup.string().required("Table ID is a required field"),
	query: yup.string().required("Query is a required field"),
});

const BigQuery = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("project_id") }}
			fieldMetaProps={{ ...formik.getFieldMeta("project_id") }}
			fullWidth
			label="Project ID"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("dataset_id") }}
			fieldMetaProps={{ ...formik.getFieldMeta("dataset_id") }}
			fullWidth
			label="Dataset ID"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("table_id") }}
			fieldMetaProps={{ ...formik.getFieldMeta("table_id") }}
			fullWidth
			label="Table ID"
			required
		/>
	</>
);

export default BigQuery;
