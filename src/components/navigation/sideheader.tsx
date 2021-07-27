import { useState } from "react";

import {
	ListItemIcon,
	ListItemText,
	ListItem,
	IconButton,
	CssBaseline,
	Drawer,
	Divider,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DescriptionIcon from "@material-ui/icons/Description";
import HomeIcon from "@material-ui/icons/Home";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SettingsIcon from "@material-ui/icons/Settings";
import ViewListIcon from "@material-ui/icons/ViewList";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	palette: {
		primary: blue,
	},
	menuButton: {
		marginRight: 36,
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		backgroundColor: "#464646",
	},
	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9) + 1,
		},
		backgroundColor: "#464646",
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	bottomPush: {
		display: "fixed",
		bottom: 0,
		paddingBottom: 10,
	},
}));

const itemList: Array<string> = [
	"Home",
	"Workflows",
	"Templates",
	"Schedule",
	"Settings",
];

const SideHeader = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const history = useHistory();
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleListItemClick = (index: number) => {
		setSelectedIndex(index);
		localStorage.setItem("currentPage", itemList[index]);
		history.push("/" + itemList[index].toLowerCase());
	};

	const handleDrawerClick = () => {
		open ? handleDrawerClose() : handleDrawerOpen();
	};

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
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
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClick}>
						{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<ListItem
					button
					selected={selectedIndex === 0}
					onClick={() => handleListItemClick(0)}
				>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</ListItem>
				<Divider />
				<ListItem
					button
					selected={selectedIndex === 1}
					onClick={() => handleListItemClick(1)}
				>
					<ListItemIcon>
						<ViewListIcon />
					</ListItemIcon>
					<ListItemText primary="Workflows" />
				</ListItem>
				<ListItem
					button
					selected={selectedIndex === 2}
					onClick={() => handleListItemClick(2)}
				>
					<ListItemIcon>
						<DescriptionIcon />
					</ListItemIcon>
					<ListItemText primary="Templates" />
				</ListItem>
				<Divider />
				<ListItem
					button
					selected={selectedIndex === 3}
					onClick={() => handleListItemClick(3)}
				>
					<ListItemIcon>
						<ScheduleIcon />
					</ListItemIcon>
					<ListItemText primary="Schedule" />
				</ListItem>
				<Divider />
				<ListItem
					button
					selected={selectedIndex === 4}
					onClick={() => handleListItemClick(4)}
					className={classes.bottomPush}
				>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Settings" />
				</ListItem>
			</Drawer>
		</div>
	);
};

export default SideHeader;
