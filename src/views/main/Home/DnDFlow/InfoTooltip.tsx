import {
	List,
	ListItem,
	makeStyles,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { Info } from "react-feather";

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
			<Typography variant="caption">
				Add a node by dragging it from the specified service categories.
			</Typography>
		</ListItem>
		<ListItem divider>
			<Typography variant="caption">
				Nodes that are darkened require configuration.
			</Typography>
		</ListItem>
		<ListItem divider>
			<Typography variant="caption">
				Click on a node to select and configure.
			</Typography>
		</ListItem>
		<ListItem divider>
			<Typography variant="caption">
				Remove a selected node by pressing backspace.
			</Typography>
		</ListItem>
		<ListItem>
			<Typography variant="caption">
				Hold shift to select and remove multiple nodes.
			</Typography>
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
