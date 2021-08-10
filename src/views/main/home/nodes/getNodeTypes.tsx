import { FunctionComponent } from "react";

import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
	Connection,
	Edge,
	Handle,
	NodeProps,
	Position,
} from "react-flow-renderer";

import * as nodeImages from "views/main/home/nodes/nodeImages";

type nodeTypes = {
	[key in keyof typeof nodeImages]?: FunctionComponent<NodeProps>;
};

const useStyles = makeStyles((theme) => ({
	handle: {
		width: 8,
		height: 8,
	},
	targetHandle: {
		background: theme.palette.secondary.light,
		borderColor: theme.palette.secondary.dark,
		top: -10,
	},
	sourceHandle: {
		background: theme.palette.secondary.dark,
		borderColor: theme.palette.secondary.light,
		bottom: -10,
	},
}));

const getNodeTypes = (): nodeTypes => {
	const nodeTypes: nodeTypes = {};
	let node: keyof typeof nodeImages;
	for (node in nodeImages) {
		const src = nodeImages[node]; // capture the value as we are creating closures to run "later" below

		nodeTypes[node] = function Node() {
			const classes = useStyles();
			const onConnect = (params: Connection | Edge) =>
				console.log("handle onConnect", params);
			return (
				<>
					<Handle
						className={clsx(classes.handle, classes.targetHandle)}
						type="target"
						id="operator_target"
						position={Position.Top}
						onConnect={onConnect}
					/>
					<img
						src={src}
						style={{
							cursor: "pointer",
							height: 36,
							margin: 5,
						}}
						draggable={false}
					/>
					<Handle
						className={clsx(classes.handle, classes.sourceHandle)}
						type="source"
						id="operator_source"
						position={Position.Bottom}
					/>
				</>
			);
		};
	}
	return nodeTypes;
};

export default getNodeTypes;
