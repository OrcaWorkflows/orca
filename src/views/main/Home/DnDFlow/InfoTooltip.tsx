import {
	List,
	ListItem,
	ListItemIcon,
	makeStyles,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { PanTool } from "@material-ui/icons";
import {
	Info,
	MousePointer,
	Delete,
	ArrowUpCircle,
	PlusCircle,
} from "react-feather";

const useStyles = makeStyles((theme) => ({
	infoIcon: {
		color: theme.palette.secondary.main,
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 5,
	},
}));

const infoTooltipTitle = (
	<List dense>
		<ListItem divider>
			<ListItemIcon>
				<PanTool />
			</ListItemIcon>
			<Typography variant="caption">
				Add a node by dragging it from the specified service categories.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<Info />
			</ListItemIcon>
			<Typography variant="caption">
				Nodes that are faded require configuration.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<MousePointer />
			</ListItemIcon>
			<Typography variant="caption">
				Click on a node to select and configure.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<Delete />
			</ListItemIcon>
			<Typography variant="caption">
				Remove a selected node by pressing backspace.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<ArrowUpCircle />
			</ListItemIcon>
			<Typography variant="caption">
				Hold shift to select and remove multiple nodes.
			</Typography>
		</ListItem>
		<ListItem>
			<ListItemIcon>
				<PlusCircle />
			</ListItemIcon>
			<Typography variant="caption">Add a new workflow.</Typography>
		</ListItem>
	</List>
);

const InfoTooltip = (): JSX.Element => {
	const classes = useStyles();
	return (
		<Tooltip title={infoTooltipTitle}>
			<Info className={classes.infoIcon} />
		</Tooltip>
	);
};

export default InfoTooltip;
