import { useState, PropsWithChildren } from "react";

import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

import Header from "layouts/Main/Header";
import Sidebar from "layouts/Main/Sidebar";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(6),
	},
	drawerOpen: {
		paddingLeft: theme.spacing(30),
		transition: theme.transitions.create(["padding-left"], {
			easing: theme.transitions.easing.sharp,
		}),
	},
	drawerClose: {
		paddingLeft: theme.spacing(8),
		transition: theme.transitions.create(["padding-left"], {
			easing: theme.transitions.easing.sharp,
		}),
	},
}));

const Main = (props: PropsWithChildren<Record<never, never>>): JSX.Element => {
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<>
			<Header />
			<Sidebar open={drawerOpen} setOpen={setDrawerOpen} />
			<div
				className={clsx(classes.root, {
					[classes.drawerOpen]: drawerOpen,
					[classes.drawerClose]: !drawerOpen,
				})}
			>
				<>{props.children}</>
			</div>
		</>
	);
};

export default Main;
