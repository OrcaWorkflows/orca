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
	ArrowUpRight,
	ArrowDownLeft,
	BookOpen,
	Clock,
	Home,
	List,
	Settings,
} from "react-feather";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";

import { HomeParams } from "views/main/home";

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
}));

type Routes = "home" | "workflows" | "templates" | "schedule" | "settings";
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
	const { canvasID } = useParams<HomeParams>();

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
			className={clsx({
				[classes.drawerOpen]: open,
				[classes.drawerClose]: !open,
			})}
			classes={{
				paper: clsx({
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				}),
			}}
		>
			<div className={classes.icon}>
				<IconButton onClick={handleDrawerClick}>
					{open ? <ArrowUpRight /> : <ArrowDownLeft />}
				</IconButton>
			</div>
			<Divider />
			<ListItem
				button
				component={RouterLink}
				selected={useSelectedRoute("home")}
				to={canvasID ? `/home/${canvasID}` : "/home"}
			>
				<ListItemIcon>
					<Home />
				</ListItemIcon>
				<ListItemText primary="Home" />
			</ListItem>
			<Divider />
			<ListItem
				button
				component={RouterLink}
				selected={useSelectedRoute("workflows")}
				to="/workflows"
			>
				<ListItemIcon>
					<List />
				</ListItemIcon>
				<ListItemText primary="Workflows" />
			</ListItem>
			<Divider />
			<ListItem
				button
				component={RouterLink}
				selected={useSelectedRoute("templates")}
				to="/templates"
			>
				<ListItemIcon>
					<BookOpen />
				</ListItemIcon>
				<ListItemText primary="Templates" />
			</ListItem>
			<Divider />
			<ListItem
				button
				component={RouterLink}
				selected={useSelectedRoute("schedule")}
				to="/schedule"
			>
				<ListItemIcon>
					<Clock />
				</ListItemIcon>
				<ListItemText primary="Schedule" />
			</ListItem>
			<Divider />
			<ListItem
				button
				component={RouterLink}
				selected={useSelectedRoute("settings")}
				to="/settings"
			>
				<ListItemIcon>
					<Settings />
				</ListItemIcon>
				<ListItemText primary="Settings" />
			</ListItem>
			<Divider />
		</Drawer>
	);
};

export default Sidebar;
