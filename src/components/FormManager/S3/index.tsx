import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const S3ValidationSchema = yup.object({
	bucket_name: yup.string().required("Bucket name is a required field"),
	file_path: yup.string().required("File path is a required field"),
	file_type: yup.string().required("File type is a required field"),
});

const S3 = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("bucket_name")}
			error={
				!!(
					formik.getFieldMeta("bucket_name").touched &&
					formik.getFieldMeta("bucket_name").error
				)
			}
			fullWidth
			label="Bucket Name"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("file_path")}
			error={
				!!(
					formik.getFieldMeta("file_path").touched &&
					formik.getFieldMeta("file_path").error
				)
			}
			fullWidth
			label="File Path"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("file_type")}
			error={
				!!(
					formik.getFieldMeta("file_type").touched &&
					formik.getFieldMeta("file_type").error
				)
			}
			fullWidth
			label="File Type"
			margin="dense"
			required
		/>
	</>
);
export default S3;
