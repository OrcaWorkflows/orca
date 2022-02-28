import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const KinesisValidationSchema = yup.object({
	stream_name: yup.string().required(),
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
