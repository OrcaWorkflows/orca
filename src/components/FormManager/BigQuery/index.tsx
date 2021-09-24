import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const BigQueryValidationSchema = yup.object({
	project_id: yup.string().required("Project id is a required field"),
	dataset_id: yup.string().required("Dataset id is a required field"),
	table_id: yup.string().required("Table id is a required field"),
	query: yup.string().required("Query is a required field"),
});

const BigQuery = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("project_id")}
			error={
				!!(
					formik.getFieldMeta("project_id").touched &&
					formik.getFieldMeta("project_id").error
				)
			}
			fullWidth
			label="Project ID"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("dataset_id")}
			error={
				!!(
					formik.getFieldMeta("dataset_id").touched &&
					formik.getFieldMeta("dataset_id").error
				)
			}
			fullWidth
			label="Dataset ID"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("table_id")}
			error={
				!!(
					formik.getFieldMeta("table_id").touched &&
					formik.getFieldMeta("table_id").error
				)
			}
			fullWidth
			label="Table ID"
			margin="dense"
			required
		/>
	</>
);

export default BigQuery;
