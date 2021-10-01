import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const credentialsValidationSchema = yup.object({
	username: yup.string().required("Username is a required field"),
	password: yup.string().required("Password is a required field"),
});

const Credentials = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{
				...formik.getFieldProps("username"),
			}}
			fieldMetaProps={{
				...formik.getFieldMeta("username"),
			}}
			fullWidth
			label="Username"
			required
		/>
		<TextField
			fieldInputProps={{
				...formik.getFieldProps("password"),
			}}
			fieldMetaProps={{
				...formik.getFieldMeta("password"),
			}}
			fullWidth
			label="Password"
			required
			type="password"
		/>
	</>
);

export default Credentials;
