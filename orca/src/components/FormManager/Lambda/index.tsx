import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const LambdaValidationSchema = yup.object({
	function_name: yup.string().required(),
	runtime: yup.string().required(),
	role: yup.string().required(),
	handler: yup.string().required(),
	code_s3_bucket: yup.string().required(),
	code_s3_key: yup.string().required(),
	payload: yup.string(),
});

const Kinesis = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("function_name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("function_name") }}
			fullWidth
			label="Function Name"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("runtime") }}
			fieldMetaProps={{ ...formik.getFieldMeta("runtime") }}
			fullWidth
			label="Runtime"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("role") }}
			fieldMetaProps={{ ...formik.getFieldMeta("role") }}
			fullWidth
			label="Role Arn"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("handler") }}
			fieldMetaProps={{ ...formik.getFieldMeta("handler") }}
			fullWidth
			label="Handler"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("code_s3_bucket") }}
			fieldMetaProps={{ ...formik.getFieldMeta("code_s3_bucket") }}
			fullWidth
			label="S3 Bucket"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("code_s3_key") }}
			fieldMetaProps={{ ...formik.getFieldMeta("code_s3_key") }}
			fullWidth
			label="S3 Key"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("payload") }}
			fieldMetaProps={{ ...formik.getFieldMeta("payload") }}
			fullWidth
			label="Payload"
			multiline
			required
		/>
	</>
);

export default Kinesis;
Kinesis;
