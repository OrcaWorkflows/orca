import { useState, useEffect, PropsWithChildren } from "react";

import { LinearProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import { useUserMe } from "actions/auth/useUserMe";
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
	const history = useHistory();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const { isError: isErrorUserMe, isLoading: isLoadingUserMe } = useUserMe();

	const queryClient = useQueryClient();
	useEffect(() => {
		// Will be abstracted later on
		if (isErrorUserMe) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			queryClient.clear();
			history.push("/");
		}
	}, [isErrorUserMe]);

	return isLoadingUserMe ? (
		<LinearProgress />
	) : (
		<>
			<Header />
			<Sidebar open={drawerOpen} setOpen={setDrawerOpen} />
			<div
				className={clsx(classes.root, {
					[classes.drawerOpen]: drawerOpen,
					[classes.drawerClose]: !drawerOpen,
				})}
			>
				{props.children}
			</div>
		</>
	);
};

export default Main;
