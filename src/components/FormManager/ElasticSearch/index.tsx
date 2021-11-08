import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const ElasticSearchValidationSchema = yup.object({
	index_name: yup.string().required(),
	query: yup.string()
});

const ElasticSearch = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("index_name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("index_name") }}
			fullWidth
			label="Index Name"
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

export default ElasticSearch;
