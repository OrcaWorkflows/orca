import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const ElasticSearchValidationSchema = yup.object({
	index_name: yup.string().required("Index Name is a required field"),
});

const ElasticSearch = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<TextField
		fieldInputProps={{ ...formik.getFieldProps("index_name") }}
		fieldMetaProps={{ ...formik.getFieldMeta("index_name") }}
		fullWidth
		label="Index Name"
		required
	/>
);

export default ElasticSearch;
