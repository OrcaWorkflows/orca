import { Button, Grid, TextField, Typography } from "@material-ui/core";

const ChangePassword = (): JSX.Element => {
	return (
		<Grid container direction="column" spacing={2}>
			<Grid item>
				<Typography variant="subtitle2">Enter your password</Typography>
				<TextField />
			</Grid>
			<Grid item>
				<Typography variant="subtitle2">Re-enter your password</Typography>
				<TextField />
			</Grid>
			<Grid item>
				<Typography variant="subtitle2">Enter your new password</Typography>
				<TextField />
			</Grid>
			<Grid item>
				<Button size="small">SAVE</Button>
			</Grid>
		</Grid>
	);
};

export default ChangePassword;
