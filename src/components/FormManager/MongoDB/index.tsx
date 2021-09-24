import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const MongoDBValidationSchema = yup.object({
	database_name: yup.string().required("Database name is a required field"),
	collection_name: yup.string().required("Collection name is a required field"),
});

const MongoDB = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("database_name")}
			error={
				!!(
					formik.getFieldMeta("database_name").touched &&
					formik.getFieldMeta("database_name").error
				)
			}
			fullWidth
			label="Database Name"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("collection_name")}
			error={
				!!(
					formik.getFieldMeta("collection_name").touched &&
					formik.getFieldMeta("collection_name").error
				)
			}
			fullWidth
			label="Collection Name"
			margin="dense"
			required
		/>
	</>
);

export default MongoDB;
