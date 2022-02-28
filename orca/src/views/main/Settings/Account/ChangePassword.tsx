import { Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";

import { TextField } from "components";

const ChangePassword = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Typography variant="subtitle2">Enter your password</Typography>
				<TextField
					fieldInputProps={{ ...formik.getFieldProps("password") }}
					fieldMetaProps={{ ...formik.getFieldMeta("password") }}
					fullWidth
					label="Password"
					type="password"
				/>
			</Grid>
			<Grid item xs={8}>
				<Typography variant="subtitle2">Enter your new password</Typography>
				<TextField
					fieldInputProps={{ ...formik.getFieldProps("new_password") }}
					fieldMetaProps={{ ...formik.getFieldMeta("new_password") }}
					fullWidth
					label="New Password"
					type="password"
				/>
			</Grid>
			<Grid item xs={8}>
				<Typography variant="subtitle2">Re-enter your new password</Typography>
				<TextField
					fieldInputProps={{
						...formik.getFieldProps("reentered_new_password"),
					}}
					fieldMetaProps={{ ...formik.getFieldMeta("reentered_new_password") }}
					fullWidth
					label="New Password"
					type="password"
				/>
			</Grid>
		</Grid>
	);
};

export default ChangePassword;
