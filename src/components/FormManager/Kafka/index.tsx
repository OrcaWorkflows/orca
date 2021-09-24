import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const KafkaValidationSchema = yup.object({
	topic_name: yup.string().required("Topic name is a required field"),
});

const Kafka = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			{...formik.getFieldProps("topic_name")}
			error={
				!!(
					formik.getFieldMeta("topic_name").touched &&
					formik.getFieldMeta("topic_name").error
				)
			}
			fullWidth
			label="Topic Name"
			margin="dense"
			required
		/>
	</>
);

export default Kafka;
