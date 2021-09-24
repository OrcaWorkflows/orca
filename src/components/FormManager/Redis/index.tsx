import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

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
			{...formik.getFieldProps("database")}
			error={
				!!(
					formik.getFieldMeta("database").touched &&
					formik.getFieldMeta("database").error
				)
			}
			fullWidth
			label="Database"
			margin="dense"
			required
		/>
	</>
);

export default Redis;
