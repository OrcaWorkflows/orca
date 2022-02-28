import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const KafkaValidationSchema = yup.object({
	topic_name: yup.string().required(),
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
