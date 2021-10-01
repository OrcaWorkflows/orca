import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const EMRValidationSchema = yup.object({
	script_uri: yup.string().required("Script URI is a required field"),
	input_uri: yup.string().required("Input URI is a required field"),
	master_instance_type: yup
		.string()
		.required("Master Instance Type is a required field"),
	slave_instance_type: yup
		.string()
		.required("Slave Instance Type is a required field"),
	instance_count: yup
		.number()
		.integer()
		.required("Instance Count is a required field"),
});

const EMR = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("script_uri") }}
			fieldMetaProps={{ ...formik.getFieldMeta("script_uri") }}
			fullWidth
			label="Script URI"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("input_uri") }}
			fieldMetaProps={{ ...formik.getFieldMeta("input_uri") }}
			fullWidth
			label="Input URI"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("master_instance_type") }}
			fieldMetaProps={{ ...formik.getFieldMeta("master_instance_type") }}
			fullWidth
			label="Master Instance Type"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("slave_instance_type") }}
			fieldMetaProps={{ ...formik.getFieldMeta("slave_instance_type") }}
			fullWidth
			label="Slave Instance Type"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("instance_count") }}
			fieldMetaProps={{ ...formik.getFieldMeta("instance_count") }}
			fullWidth
			label="Instance Count"
			required
		/>
	</>
);

export default EMR;
