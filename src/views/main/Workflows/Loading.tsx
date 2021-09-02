import { Grid, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
	container: { padding: 24 },
	actions: { backgroundColor: theme.palette.action.hover },
}));

const Loading = ({ rowsPerPage }: { rowsPerPage: number }): JSX.Element => {
	const classes = useStyles();
	return (
		<Grid
			className={classes.container}
			container
			justifyContent="center"
			spacing={3}
		>
			{[...Array(rowsPerPage)].map((_value, index) => (
				<Grid item xs="auto" key={index}>
					<Skeleton variant="rect" height={180} width={330} />
					<Skeleton className={classes.actions} variant="rect" height={50} />
				</Grid>
			))}
		</Grid>
	);
};

export default Loading;
