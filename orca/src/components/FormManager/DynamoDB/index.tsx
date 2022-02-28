import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const DynamoDBValidationSchema = yup.object({
	table_name: yup.string().required(),
	batch_size: yup.number().integer().required(),
});

const DynamoDB = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<>
			<TextField
				fieldInputProps={{ ...formik.getFieldProps("table_name") }}
				fieldMetaProps={{ ...formik.getFieldMeta("table_name") }}
				fullWidth
				label="Table Name"
				required
			/>
			<TextField
				fieldInputProps={{ ...formik.getFieldProps("batch_size") }}
				fieldMetaProps={{ ...formik.getFieldMeta("batch_size") }}
				fullWidth
				label="Batch Size"
				required
			/>
		</>
	);
};

export default DynamoDB;
