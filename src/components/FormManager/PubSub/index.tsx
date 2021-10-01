import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const PubSubValidationSchema = yup.object({
	project_id: yup.string().required("Project id is a required field"),
	topic: yup.string().required("Topic is a required field"),
	topic_action: yup.string().required("Topic action is a required field"),
});

const PubSub = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("project_id") }}
			fieldMetaProps={{ ...formik.getFieldMeta("project_id") }}
			fullWidth
			label="Project ID"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("topic") }}
			fieldMetaProps={{ ...formik.getFieldMeta("topic") }}
			fullWidth
			label="Topic"
			required
		/>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("topic_action") }}
			fieldMetaProps={{ ...formik.getFieldMeta("topic_action") }}
			fullWidth
			label="Topic Action"
			required
		/>
	</>
);

export default PubSub;
