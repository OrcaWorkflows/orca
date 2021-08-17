import { Fragment } from "react";

import { Grid, Divider, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
	divider: { backgroundColor: theme.palette.secondary.light },
	item: { height: 72, margin: 2 },
	text: { marginLeft: "auto" },
}));

export const Loading = ({
	rowsPerPage,
}: {
	rowsPerPage: number;
}): JSX.Element | null => {
	const classes = useStyles();

	return (
		<>
			{[...Array(rowsPerPage + 1)].map((_, index) => (
				<Fragment key={index}>
					<Grid className={classes.item} container alignItems="center">
						<Grid item md={4}>
							<Skeleton variant="text" width={150} />
						</Grid>
						<Grid item md={2}>
							<Skeleton className={classes.text} variant="text" width={50} />
						</Grid>
						<Grid item md={2}>
							<Skeleton className={classes.text} variant="text" width={80} />
						</Grid>
						<Grid item md={2}>
							<Skeleton className={classes.text} variant="text" width={80} />
						</Grid>
						<Grid item md={2}>
							<Skeleton className={classes.text} variant="text" width={30} />
						</Grid>
					</Grid>
					<Divider className={classes.divider} />
				</Fragment>
			))}
		</>
	);
};

export default Loading;
