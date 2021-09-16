import { Fragment, useState, DragEvent } from "react";

import {
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemText,
	makeStyles,
} from "@material-ui/core";
import { ArrowDown, ArrowUp } from "react-feather";

import DraggableListItem from "./DraggableListItem";

type StackData = {
	text: string;
	options: { type: string; icon: string; supported: boolean }[];
};

const useStyles = makeStyles(() => ({
	collapsableText: { fontWeight: "bold" },
}));

const CollapsibleStack = ({
	data,
	draggable,
	onDragStart,
}: {
	data: StackData;
	draggable: boolean;
	onDragStart: (event: DragEvent<Element>, data: string) => void;
}): JSX.Element => {
	const classes = useStyles();
	const [open, setOpen] = useState(true);

	const handleClick = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	return (
		<Fragment key={data.text}>
			<ListItem button onClick={handleClick}>
				<ListItemText
					primaryTypographyProps={{ className: classes.collapsableText }}
					primary={data.text}
				/>
				{open ? <ArrowUp /> : <ArrowDown />}
			</ListItem>
			<Collapse in={open} timeout="auto">
				<List disablePadding>
					{data.options.map(
						(option) =>
							draggable && (
								<DraggableListItem
									data={option}
									key={option.type}
									onDragStart={onDragStart}
								/>
							)
					)}
				</List>
			</Collapse>
			<Divider />
		</Fragment>
	);
};

export default CollapsibleStack;
