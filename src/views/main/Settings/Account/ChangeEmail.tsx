import { Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";

import { TextField } from "components";

const ChangeEmail = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Typography variant="subtitle2">Enter your new email</Typography>
				<TextField
					fieldInputProps={{ ...formik.getFieldProps("new_email") }}
					fieldMetaProps={{ ...formik.getFieldMeta("new_email") }}
					fullWidth
					label="New Email"
				/>
			</Grid>
		</Grid>
	);
};

export default ChangeEmail;
