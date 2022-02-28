import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

interface CredentialsSchema {
	username?: string;
	password?: string;
}

export const credentialsValidationSchema: yup.SchemaOf<CredentialsSchema> =
	yup.object({
		username: yup
			.string()
			.when("$operatorName", (operatorName, schema) =>
				operatorName === "redis" ? schema.optional() : schema.required()
			),
		password: yup
			.string()
			.when("$operatorName", (operatorName, schema) =>
				operatorName === "redis" ? schema.optional() : schema.required()
			),
	});

const Credentials = ({
	formik,
	operatorName,
}: {
	formik: ReturnType<typeof useFormik>;
	operatorName: string;
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
			{...(operatorName !== "redis" ? { required: true } : {})}
			label="Username"
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
			{...(operatorName !== "redis" ? { required: true } : {})}
			type="password"
		/>
	</>
);

export default Credentials;
