import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const KafkaValidationSchema = yup.object({
	topic_name: yup.string().required("Topic Name is a required field"),
});

const Kafka = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<>
		<TextField
			fieldInputProps={{ ...formik.getFieldProps("topic_name") }}
			fieldMetaProps={{ ...formik.getFieldMeta("topic_name") }}
			fullWidth
			label="Topic Name"
			required
		/>
	</>
);

export default Kafka;
