import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const credentialsValidationSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().required(),
});

const Credentials = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("username")}
			error={
				!!(
					formik.getFieldMeta("username").touched &&
					formik.getFieldMeta("username").error
				)
			}
			fullWidth
			label="Username"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("password")}
			error={
				!!(
					formik.getFieldMeta("password").touched &&
					formik.getFieldMeta("password").error
				)
			}
			fullWidth
			label="Password"
			margin="dense"
			type="password"
			required
		/>
	</>
);

export default Credentials;
