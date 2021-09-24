import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const EMRValidationSchema = yup.object({
	script_uri: yup.string().required("Script uri is a required field"),
	input_uri: yup.string().required("Input uri is a required field"),
	master_instance_type: yup
		.string()
		.required("Master instance type is a required field"),
	slave_instance_type: yup
		.string()
		.required("Slave instance type is a required field"),
	instance_count: yup
		.number()
		.integer()
		.required("Instance count is a required field"),
});

const EMR = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("script_uri")}
			error={
				!!(
					formik.getFieldMeta("script_uri").touched &&
					formik.getFieldMeta("script_uri").error
				)
			}
			fullWidth
			label="Script URI"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("input_uri")}
			error={
				!!(
					formik.getFieldMeta("input_uri").touched &&
					formik.getFieldMeta("input_uri").error
				)
			}
			fullWidth
			label="Input URI"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("master_instance_type")}
			error={
				!!(
					formik.getFieldMeta("master_instance_type").touched &&
					formik.getFieldMeta("master_instance_type").error
				)
			}
			fullWidth
			label="Master Instance Type"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("slave_instance_type")}
			error={
				!!(
					formik.getFieldMeta("slave_instance_type").touched &&
					formik.getFieldMeta("slave_instance_type").error
				)
			}
			fullWidth
			label="Slave Instance Type"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("instance_count")}
			error={
				!!(
					formik.getFieldMeta("instance_count").touched &&
					formik.getFieldMeta("instance_count").error
				)
			}
			fullWidth
			label="Instance Count"
			margin="dense"
			required
		/>
	</>
);

export default EMR;
