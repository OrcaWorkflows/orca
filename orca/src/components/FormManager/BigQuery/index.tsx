import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const BigQueryValidationSchema = yup.object({
	project_id: yup.string().required(),
	dataset_id: yup.string().required(),
	table_id: yup.string().required(),
	query: yup.string().required(),
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
