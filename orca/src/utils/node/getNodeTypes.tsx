import { FunctionComponent } from "react";

import { Tooltip, Zoom, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
	// Connection,
	// Edge,
	Handle,
	NodeProps,
	Position,
} from "react-flow-renderer";

import * as nodeImages from "utils/node/nodeImages";

type nodeTypes = {
	[key in keyof typeof nodeImages]?: FunctionComponent<NodeProps>;
};

const useStyles = makeStyles((theme) => ({
	handle: {
		width: 8,
		height: 8,
	},
	targetHandle: {
		background: theme.palette.common.white,
		borderColor: theme.palette.common.black,
		top: -10,
	},
	sourceHandle: {
		background: theme.palette.common.black,
		borderColor: theme.palette.common.white,
		bottom: -10,
	},
	nodeImg: (props: { selected: boolean }) => ({
		border: props.selected
			? `2px solid ${theme.palette.secondary.light}`
			: "unset",
		borderRadius: theme.shape.borderRadius,
		cursor: "pointer",
		height: props.selected ? 48 : 36,
		margin: 5,
		padding: props.selected ? 4 : "unset",
	})
}));

const getNodeTypes = (): nodeTypes => {
	const nodeTypes: nodeTypes = {};
	let node: keyof typeof nodeImages;
	for (node in nodeImages) {
		const src = nodeImages[node];

		nodeTypes[node] = (props: NodeProps) => {
			const classes = useStyles({ selected: props.selected });

			return (
				<>
					<Handle
						className={clsx(classes.handle, classes.targetHandle, {})}
						type="target"
						id=":operator_target"
						position={Position.Top}
					/>
					<Tooltip
						arrow
						TransitionComponent={Zoom}
						title={props.id}
						placement="right"
					>
						<img
							className={clsx(classes.nodeImg, {})}
							src={src}
							draggable={false}
							onDragStart={(event) => {
								// Firefox
								event.preventDefault();
							}}
						/>
					</Tooltip>
					<Handle
						className={clsx(classes.handle, classes.sourceHandle, {})}
						type="source"
						id=":operator_source"
						position={Position.Bottom}
					/>
				</>
			);
		};
	}
	return nodeTypes;
};

export default getNodeTypes;
