import { Dispatch, SetStateAction } from "react";

import {
	IconButton,
	Drawer,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
	FiArrowUpRight,
	FiArrowDownLeft,
	FiBook,
	FiClock,
	FiHome,
	FiList,
	FiSettings,
} from "react-icons/fi";
import { Link as RouterLink, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	drawerOpen: {
		width: theme.spacing(30),
		transition: theme.transitions.create(["background-color", "width"], {
			easing: theme.transitions.easing.sharp,
		}),
		backgroundColor: theme.palette.primary.main,
	},
	drawerClose: {
		width: theme.spacing(8),
		transition: theme.transitions.create(["background-color", "width"], {
			easing: theme.transitions.easing.sharp,
		}),
		overflowX: "hidden",
		backgroundColor: theme.palette.primary.dark,
	},
	icon: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		...theme.mixins.toolbar, // necessary for content to be below app bar
	},
	selected: {
		borderRadius: theme.shape.borderRadius,
	},
}));

type Routes = "home" | "workflows" | "monitor" | "schedule" | "settings";
const useSelectedRoute = (route: Routes) => {
	const history = useHistory();
	return history.location.pathname.includes(route) ? true : false;
};

type Props = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ open, setOpen }: Props): JSX.Element => {
	const classes = useStyles();

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const handleDrawerClick = () => {
		open ? handleDrawerClose() : handleDrawerOpen();
	};

	return (
		<Drawer
			variant="permanent"
			classes={{
				paper: clsx({
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				}),
			}}
		>
			<div className={classes.icon}>
				<IconButton onClick={handleDrawerClick}>
					{open ? <FiArrowUpRight /> : <FiArrowDownLeft />}
				</IconButton>
			</div>
			<Divider />
			<ListItem
				className={clsx({ [classes.selected]: useSelectedRoute("home") })}
				button
				component={RouterLink}
				selected={useSelectedRoute("home")}
				to="/home"
			>
				<ListItemIcon>
					<FiHome />
				</ListItemIcon>
				<ListItemText primary="Home" />
			</ListItem>
			<Divider />
			<ListItem
				className={clsx({ [classes.selected]: useSelectedRoute("workflows") })}
				button
				component={RouterLink}
				selected={useSelectedRoute("workflows")}
				to="/workflows"
			>
				<ListItemIcon>
					<FiBook />
				</ListItemIcon>
				<ListItemText primary="Workflows" />
			</ListItem>
			<Divider />
			<ListItem
				className={clsx({ [classes.selected]: useSelectedRoute("monitor") })}
				button
				component={RouterLink}
				selected={useSelectedRoute("monitor")}
				to="/monitor"
			>
				<ListItemIcon>
					<FiList />
				</ListItemIcon>
				<ListItemText primary="Monitor" />
			</ListItem>
			<Divider />
			<ListItem
				className={clsx({ [classes.selected]: useSelectedRoute("schedule") })}
				button
				component={RouterLink}
				disabled
				selected={useSelectedRoute("schedule")}
				to="/schedule"
			>
				<ListItemIcon>
					<FiClock />
				</ListItemIcon>
				<ListItemText primary="Schedule" />
			</ListItem>
			<Divider />
			<ListItem
				className={clsx({ [classes.selected]: useSelectedRoute("settings") })}
				button
				component={RouterLink}
				selected={useSelectedRoute("settings")}
				to="/settings"
			>
				<ListItemIcon>
					<FiSettings />
				</ListItemIcon>
				<ListItemText primary="Settings" />
			</ListItem>
			<Divider />
		</Drawer>
	);
};

export default Sidebar;
