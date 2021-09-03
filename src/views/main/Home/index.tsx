import { Grid, Divider, Paper, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import DnDFlow from "views/main/Home/DnDFlow";
import Sidebar from "views/main/Home/Sidebar";

const useStyles = makeStyles((theme) => ({
	fullHeight: { height: "100%" },
	root: { height: "calc(100vh - 48px)" },
	sidebar: {
		width: theme.spacing(30),
	},
	DnDFlow: {
		margin: 20,
	},
}));

export type HomeParams = {
	workflowID: string;
};

const Home = (): JSX.Element => {
	const classes = useStyles();
	return (
		<Paper className={classes.root}>
			<Grid
				container
				className={classes.fullHeight}
				justifyContent="space-between"
			>
				<OverlayScrollbarsComponent
					options={{
						scrollbars: { autoHide: "leave" },
					}}
				>
					<Grid
						item
						className={clsx(classes.fullHeight, classes.sidebar)}
						xs="auto"
					>
						<Sidebar />
					</Grid>
				</OverlayScrollbarsComponent>
				<Divider flexItem orientation="vertical" />
				<Grid item className={(classes.fullHeight, classes.DnDFlow)} xs>
					<Paper className={classes.fullHeight} variant="outlined">
						<DnDFlow />
					</Paper>
				</Grid>

				{/* <Grid item className={classes.fullHeight} xs="auto">
					Monitoring
				</Grid> */}
			</Grid>
		</Paper>
	);
};

export default Home;