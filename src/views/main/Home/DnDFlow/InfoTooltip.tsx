import {
	List,
	ListItem,
	ListItemIcon,
	makeStyles,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { BsFillHandIndexThumbFill } from "react-icons/bs";
import { FiInfo, FiMousePointer, FiDelete, FiPlusCircle } from "react-icons/fi";
import { ImShift } from "react-icons/im";
import { RiDragDropLine } from "react-icons/ri";

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
				<RiDragDropLine />
			</ListItemIcon>
			<Typography variant="caption">
				Add a node by dragging it from the specified service categories.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<FiInfo />
			</ListItemIcon>
			<Typography variant="caption">
				Nodes that are faded require configuration.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<BsFillHandIndexThumbFill />
			</ListItemIcon>
			<Typography variant="caption">
				Click on a node to select and configure.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<BsFillHandIndexThumbFill />
			</ListItemIcon>
			<Typography variant="caption">
				Click on a edge to select and see the related logs.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<FiDelete />
			</ListItemIcon>
			<Typography variant="caption">
				Remove the selected elements by pressing backspace.
			</Typography>
		</ListItem>
		<ListItem divider>
			<ListItemIcon>
				<ImShift />
			</ListItemIcon>
			<Typography variant="caption">
				Hold shift to select and remove multiple elements.
			</Typography>
		</ListItem>
		<ListItem>
			<ListItemIcon>
				<FiPlusCircle />
			</ListItemIcon>
			<Typography variant="caption">Add a new workflow.</Typography>
		</ListItem>
	</List>
);

const InfoTooltip = (): JSX.Element => {
	const classes = useStyles();
	return (
		<Tooltip title={infoTooltipTitle}>
			<div className={classes.infoIcon}>
				<FiInfo />
			</div>
		</Tooltip>
	);
};

export default InfoTooltip;
