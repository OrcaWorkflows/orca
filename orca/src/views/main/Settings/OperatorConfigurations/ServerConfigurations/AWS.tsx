import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const AWSValidationSchema = yup.object({
	property: yup.object({
		AWS_REGION_NAME: yup.string().required(),
		AWS_ACCESS_KEY_ID: yup.string().required(),
		AWS_ACCESS_SECRET_KEY: yup.string().required(),
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
