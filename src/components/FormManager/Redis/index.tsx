import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const RedisValidationSchema = yup.object({
	database: yup.string().required(),
});

const Redis = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("database") }}
			fieldMetaProps={{ ...formik.getFieldMeta("database") }}
			fullWidth
			label="Database"
			required
		/>
	</>
);

export default Redis;
