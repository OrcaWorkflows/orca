import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const S3ValidationSchema = yup.object({
	bucket_name: yup.string().required("Bucket Name is a required field"),
	file_path: yup.string().required("File Path is a required field"),
	file_type: yup.string().required("File Type is a required field"),
});

const S3 = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("bucket_name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("bucket_name") }}
			fullWidth
			label="Bucket Name"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("file_path") }}
			fieldMetaProps={{ ...formik.getFieldMeta("file_path") }}
			fullWidth
			label="File Path"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("file_type") }}
			fieldMetaProps={{ ...formik.getFieldMeta("file_type") }}
			fullWidth
			label="File Type"
			required
		/>
	</>
);
export default S3;
