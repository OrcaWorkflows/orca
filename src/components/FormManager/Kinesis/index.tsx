import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

export const KinesisValidationSchema = yup.object({
	stream_name: yup.string().required("Stream name is a required field"),
});

const Kinesis = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
	<TextField
		{...formik.getFieldProps("stream_name")}
		error={
			!!(
				formik.getFieldMeta("stream_name").touched &&
				formik.getFieldMeta("stream_name").error
			)
		}
		fullWidth
		label="Stream Name"
		margin="dense"
		required
	/>
);

export default Kinesis;
Kinesis;
