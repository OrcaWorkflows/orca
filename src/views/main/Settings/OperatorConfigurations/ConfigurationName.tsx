import { useFormik } from "formik";

import { TextField } from "components";

const ConfigurationName = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("name") }}
			fullWidth
			label="Configuration Name"
			required
		/>
	);
};

export default ConfigurationName;
