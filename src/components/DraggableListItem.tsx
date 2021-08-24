import { DragEvent } from "react";

import {
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	draggable: {
		borderLeft: `4px solid ${theme.palette.secondary.dark}`,
		cursor: "grabbing",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
	},
	dragging: {
		color: theme.palette.primary.main,
		borderBottom: `2px solid ${theme.palette.secondary.dark}`,
		borderTop: `2px solid ${theme.palette.secondary.dark}`,
		padding: 20,
		transition: theme.transitions.create(["padding"], {
			easing: theme.transitions.easing.sharp,
		}),
		"&:active": {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	draggingText: {
		fontWeight: "bold",
	},
}));
const DraggableListItem = ({
	data,
	onDragStart,
}: {
	data: { text: string; icon: string };
	onDragStart: (event: DragEvent, data: string) => void;
}): JSX.Element => {
	const classes = useStyles();
	return (
		<ListItem
			className={classes.draggable}
			key={data.text}
			onDragStart={(event: DragEvent) => {
				onDragStart(event, data.text);
				(event.target as Element).classList.add(classes.dragging);
				(
					event.target as Element
				).lastElementChild?.lastElementChild?.classList.add(
					classes.draggingText
				);
			}}
			onDragEnd={(event: DragEvent) => {
				(event.target as Element).classList.remove(classes.dragging);
				(
					event.target as Element
				).lastElementChild?.lastElementChild?.classList.remove(
					classes.draggingText
				);
			}}
			draggable
		>
			<ListItemIcon>
				<img src={data.icon} style={{ height: 36 }} draggable={false} />
			</ListItemIcon>
			<ListItemText primary={data.text} />
		</ListItem>
	);
};

export default DraggableListItem;
