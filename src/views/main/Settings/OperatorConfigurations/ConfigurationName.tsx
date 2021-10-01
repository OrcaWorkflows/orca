import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const configurationNameValidationSchema = yup.object({
	name: yup.string().required("Configuration Name is a required field"),
});

const ConfigurationName = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<TextField
		fieldInputProps={{ ...formik.getFieldProps("name") }}
		fieldMetaProps={{ ...formik.getFieldMeta("name") }}
		fullWidth
		label="Configuration Name"
		required
	/>
);

export default ConfigurationName;
