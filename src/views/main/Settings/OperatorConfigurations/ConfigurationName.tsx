import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const configurationNameValidationSchema = yup.object({
	name: yup.string().required(),
});

const ConfigurationName = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<TextField
		{...formik.getFieldProps("name")}
		error={
			!!(
				formik.getFieldMeta("name").touched && formik.getFieldMeta("name").error
			)
		}
		label="Name of the configuration"
		required
		margin="dense"
		variant="standard"
	/>
);

export default ConfigurationName;
