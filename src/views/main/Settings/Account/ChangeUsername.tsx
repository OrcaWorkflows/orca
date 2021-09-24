import { Button, Grid, TextField, Typography } from "@material-ui/core";

const ChangeUsername = (): JSX.Element => {
	return (
		<Grid container direction="column" spacing={2}>
			<Grid item>
				<Typography variant="subtitle2">Enter your username</Typography>
				<TextField />
			</Grid>
			<Grid item>
				<Typography variant="subtitle2">Enter your new username</Typography>
				<TextField />
			</Grid>
			<Grid item>
				<Button size="small">SAVE</Button>
			</Grid>
		</Grid>
	);
};

export default ChangeUsername;
