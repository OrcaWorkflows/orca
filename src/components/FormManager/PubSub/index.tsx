import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const PubSubValidationSchema = yup.object({
	project_id: yup.string().required(),
	topic: yup.string().required(),
	topic_action: yup.string().required(),
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
