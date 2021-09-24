import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const ElasticSearchValidationSchema = yup.object({
	index_name: yup.string().required("Index name is a required field"),
});

const ElasticSearch = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("index_name")}
			error={
				!!(
					formik.getFieldMeta("index_name").touched &&
					formik.getFieldMeta("index_name").error
				)
			}
			fullWidth
			label="Index Name"
			margin="dense"
			required
		/>
	</>
);

export default ElasticSearch;
