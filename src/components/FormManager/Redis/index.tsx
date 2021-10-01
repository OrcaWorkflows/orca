import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const RedisValidationSchema = yup.object({
	database: yup.string().required("Database is a required field"),
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
