import React, {useState} from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from "react-router-dom";

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
    ListItemIcon,
    ListItemText,
    ListItem,
    IconButton,
    CssBaseline,
    Drawer,
    Divider
} from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HomeIcon from '@material-ui/icons/Home';
import {blue} from "@material-ui/core/colors";
import ViewListIcon from '@material-ui/icons/ViewList';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import State from "../data/state";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    palette: {
        primary: blue,
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: '#464646'
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
        backgroundColor: '#464646'
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        paddingBottom: 10
    }
}));

const itemList:Array<string> = ["Home", "Workflows", "Templates", "Schedule", "Settings"];

const SideHeader = () => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const history = useHistory();
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleListItemClick = (event:any, index:number) => {
        setSelectedIndex(index);
        localStorage.setItem("currentPage",  itemList[index]);
        history.push("/" + itemList[index].toLowerCase());
    };

    const handleDrawerClick = (event:any) => {
        open ? handleDrawerClose() : handleDrawerOpen();
    }

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
                    onClick={(event) => handleListItemClick(event, 0)}
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
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <ViewListIcon />
                    </ListItemIcon>
                    <ListItemText primary="Workflows" />
                </ListItem>
                <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={(event) => handleListItemClick(event, 2)}
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
                    onClick={(event) => handleListItemClick(event, 3)}
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
                    onClick={(event) => handleListItemClick(event, 4)}
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