import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const MongoDBValidationSchema = yup.object({
	database_name: yup.string().required(),
	collection_name: yup.string().required(),
	query: yup.string(),
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
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("query") }}
			fieldMetaProps={{ ...formik.getFieldMeta("query") }}
			fullWidth
			label="Query"
			multiline
		/>
	</>
);

export default MongoDB;
