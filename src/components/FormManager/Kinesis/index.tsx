import { useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "components";

export const KinesisValidationSchema = yup.object({
	stream_name: yup.string().required("Stream Name is a required field"),
});

const Kinesis = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<TextField
		fieldInputProps={{ ...formik.getFieldProps("stream_name") }}
		fieldMetaProps={{ ...formik.getFieldMeta("stream_name") }}
		fullWidth
		label="Stream Name"
		required
	/>
);

export default Kinesis;
Kinesis;
