import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const MongoDBValidationSchema = yup.object({
	database_name: yup.string().required("Database Name is a required field"),
	collection_name: yup.string().required("Collection Name is a required field"),
});

const MongoDB = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("database_name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("database_name") }}
			fullWidth
			label="Database Name"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("collection_name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("collection_name") }}
			fullWidth
			label="Collection Name"
			required
		/>
	</>
);

export default MongoDB;
