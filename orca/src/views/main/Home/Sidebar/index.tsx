import { DragEvent } from "react";

import { List, makeStyles } from "@material-ui/core";
import clsx from "clsx";

import CollapsibleStack from "components/CollapsibleStack";
import { platforms } from "utils";

const useStyles = makeStyles(() => ({
	fullHeight: { height: "100%" },
	list: {
		overflowY: "auto",
	},
}));

const Sidebar = (): JSX.Element => {
	const classes = useStyles();

	const onDragStart = (event: DragEvent<Element>, data: string): void => {
		event.dataTransfer.setData("application/reactflow", data);
		event.dataTransfer.effectAllowed = "move";
	};
	return (
		<List className={clsx(classes.fullHeight, classes.list)}>
			{platforms.map((stackData) => (
				<CollapsibleStack
					data={stackData}
					draggable
					onDragStart={onDragStart}
					key={stackData.text}
				/>
			))}
		</List>
	);
};

export default Sidebar;
