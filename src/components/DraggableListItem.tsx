import { DragEvent } from "react";

import {
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Theme,
} from "@material-ui/core";
import clsx from "clsx";

type StyleProps = {
	supported: boolean;
};

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
	unusable: {
		WebkitFilter: "blur(1px) grayscale(100%)" /* Safari 6.0 - 9.0 */,
		filter: "blur(1px) grayscale(100%)",
	},
	draggable: {
		borderLeft: `4px solid ${theme.palette.secondary.main}`,
		cursor: "grabbing",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
	},
	dragging: {
		color: theme.palette.primary.light,
		padding: 20,
		transition: theme.transitions.create(["padding"], {
			easing: theme.transitions.easing.sharp,
		}),
		"&:active": {
			backgroundColor: theme.palette.secondary.light,
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
	data: { text: string; icon: string; supported: boolean };
	onDragStart: (event: DragEvent, data: string) => void;
}): JSX.Element => {
	const classes = useStyles({ supported: data.supported });

	return (
		<ListItem
			className={clsx({
				[classes.draggable]: data.supported,
				[classes.unusable]: !data.supported,
			})}
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
			draggable={data.supported}
		>
			<ListItemIcon>
				<img src={data.icon} style={{ height: 36 }} draggable={false} />
			</ListItemIcon>
			<ListItemText primary={data.text} />
		</ListItem>
	);
};

export default DraggableListItem;
