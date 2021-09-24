import {
	Divider,
	Grid,
	Paper,
	Typography,
	makeStyles,
} from "@material-ui/core";
import clsx from "clsx";

// import { useQueryClient } from "react-query";

import ChangePassword from "views/main/Settings/Account/ChangePassword";
import ChangeUsername from "views/main/Settings/Account/ChangeUsername";

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
	marginTop: { marginTop: 10 },
	paper: {
		padding: theme.spacing(1),
	},
}));

export const Account = (): JSX.Element => {
	const classes = useStyles();

	return (
		<Grid container direction="column" spacing={2}>
			<Grid item>
				<Typography variant="caption">Update your account</Typography>
				<Typography className={classes.bold} variant="h6">
					{localStorage.getItem("username")}
				</Typography>
			</Grid>
			<Grid item xs>
				<Paper className={classes.paper}>
					<Typography
						className={clsx(classes.bold, classes.marginTop)}
						gutterBottom
						variant="h6"
					>
						Change your username
					</Typography>
					<Divider />
					<ChangeUsername />
					<Typography
						className={clsx(classes.bold, classes.marginTop)}
						gutterBottom
						variant="h6"
					>
						Change your password
					</Typography>
					<Divider />
					<ChangePassword />
				</Paper>
			</Grid>
		</Grid>
	);
};

export default Account;
