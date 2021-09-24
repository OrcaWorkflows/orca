import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

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
			{...formik.getFieldProps("project_id")}
			error={
				!!(
					formik.getFieldMeta("project_id").touched &&
					formik.getFieldMeta("project_id").error
				)
			}
			fullWidth
			label="Project ID"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("topic")}
			error={
				!!(
					formik.getFieldMeta("topic").touched &&
					formik.getFieldMeta("topic").error
				)
			}
			fullWidth
			label="Topic"
			margin="dense"
			required
		/>
		<TextField
			{...formik.getFieldProps("topic_action")}
			error={
				!!(
					formik.getFieldMeta("topic_action").touched &&
					formik.getFieldMeta("topic_action").error
				)
			}
			fullWidth
			label="Topic Action"
			margin="dense"
			required
		/>
	</>
);

export default PubSub;
