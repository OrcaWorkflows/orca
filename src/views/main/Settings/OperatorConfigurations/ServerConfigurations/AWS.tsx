import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const AWSValidationSchema = yup.object({
	property: yup.object({
		AWS_REGION_NAME: yup.string().required("Region Name is a required field"),
		AWS_ACCESS_KEY_ID: yup
			.string()
			.required("Access Key ID is a required field"),
		AWS_ACCESS_SECRET_KEY: yup
			.string()
			.required("Access Secret Key is a required field"),
	}),
});

const Credentials = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{
				...formik.getFieldProps("property.AWS_REGION_NAME"),
			}}
			fieldMetaProps={{
				...formik.getFieldMeta("property.AWS_REGION_NAME"),
			}}
			fullWidth
			label="Region Name"
			required
		/>
		<TextField
			fieldInputProps={{
				...formik.getFieldProps("property.AWS_ACCESS_KEY_ID"),
			}}
			fieldMetaProps={{
				...formik.getFieldMeta("property.AWS_ACCESS_KEY_ID"),
			}}
			fullWidth
			label="Access Key ID"
			required
		/>
		<TextField
			fieldInputProps={{
				...formik.getFieldProps("property.AWS_ACCESS_SECRET_KEY"),
			}}
			fieldMetaProps={{
				...formik.getFieldMeta("property.AWS_ACCESS_SECRET_KEY"),
			}}
			fullWidth
			label="Access Secret Key"
			required
			type="password"
		/>
	</>
);

export default Credentials;
