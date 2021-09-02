import { Fab, makeStyles, Tooltip } from "@material-ui/core";
import { Plus } from "react-feather";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
	addIcon: {
		position: "absolute",
		bottom: 10,
		right: 10,
		zIndex: 5,
	},
}));

const AddTooltip = (): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();
	return (
		<Tooltip title="New workflow">
			<Fab
				className={classes.addIcon}
				size="medium"
				color="secondary"
				onClick={() => {
					localStorage.removeItem("lastWorkflowID");
					history.replace("/home");
				}}
			>
				<Plus />
			</Fab>
		</Tooltip>
	);
};

export default AddTooltip;
