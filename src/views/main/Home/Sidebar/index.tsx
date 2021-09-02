import { DragEvent } from "react";

import { List } from "@material-ui/core";

import CollapsibleStack from "components/CollapsibleStack";
import { platforms } from "utils";

const Sidebar = (): JSX.Element => {
	const onDragStart = (event: DragEvent<Element>, data: string): void => {
		event.dataTransfer.setData("application/reactflow", data);
		event.dataTransfer.effectAllowed = "move";
	};
	return (
		<List>
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
