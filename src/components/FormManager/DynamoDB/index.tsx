import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const DynamoDBValidationSchema = yup.object({
	table_name: yup.string().required("Table name is a required field"),
	batch_size: yup.number().integer().required("Batch size is a required field"),
});

const DynamoDB = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<>
			<TextField
				{...formik.getFieldProps("table_name")}
				error={
					!!(
						formik.getFieldMeta("table_name").touched &&
						formik.getFieldMeta("table_name").error
					)
				}
				fullWidth
				label="Table Name"
				margin="dense"
				required
			/>
			<TextField
				{...formik.getFieldProps("batch_size")}
				error={
					!!(
						formik.getFieldMeta("batch_size").touched &&
						formik.getFieldMeta("batch_size").error
					)
				}
				fullWidth
				label="Batch Size"
				margin="dense"
				required
			/>
		</>
	);
};

export default DynamoDB;
