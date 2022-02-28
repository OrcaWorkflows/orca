import { Fragment, useState, DragEvent, MouseEvent } from "react";

import {
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from "@material-ui/core";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

import DraggableListItem from "./DraggableListItem";

type StackData = {
	text: string;
	options: { type: string; icon: string; supported: boolean; text: string }[];
};

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
}));

const CollapsibleStack = ({
	iconSize = 36,
	data,
	draggable,
	onDragStart,
	onClick,
	selectedOptionType,
}: {
	iconSize?: number;
	data: StackData;
	draggable?: boolean | undefined;
	onDragStart?: ((event: DragEvent<Element>, data: string) => void) | undefined;
	onClick?: ((event: MouseEvent<Element>, data: string) => void) | undefined;
	selectedOptionType?: string;
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
					primaryTypographyProps={{ className: classes.bold }}
					primary={data.text}
				/>
				{open ? <FiArrowUp /> : <FiArrowDown />}
			</ListItem>
			<Collapse in={open} timeout="auto">
				<List disablePadding>
					{data.options.map((option) =>
						draggable ? (
							<DraggableListItem
								data={option}
								key={option.type}
								onDragStart={
									onDragStart as (
										event: DragEvent<Element>,
										data: string
									) => void
								}
							/>
						) : (
							<ListItem
								button
								disabled={!option.supported}
								key={option.type}
								onClick={(event) => onClick && onClick(event, option.type)}
								selected={option.type === selectedOptionType}
							>
								<ListItemIcon>
									<img
										src={option.icon}
										style={{ height: iconSize }}
										draggable={false}
									/>
								</ListItemIcon>
								<ListItemText primary={option.text} />
							</ListItem>
						)
					)}
				</List>
			</Collapse>
			<Divider />
		</Fragment>
	);
};

export default CollapsibleStack;
