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
import useValidateNode from "utils/node/useValidateNode";

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
	}),
	unusable: {
		WebkitFilter: "grayscale(85%)" /* Safari 6.0 - 9.0 */,
		filter: "grayscale(85%)",
	},
}));

const getNodeTypes = (): nodeTypes => {
	const nodeTypes: nodeTypes = {};
	let node: keyof typeof nodeImages;
	for (node in nodeImages) {
		const src = nodeImages[node];

		nodeTypes[node] = (props: NodeProps) => {
			const classes = useStyles({ selected: props.selected });

			const [nodeValidationErrors] = useValidateNode(props.type, props.data);
			const unusable = !!nodeValidationErrors.length;

			return (
				<>
					<Handle
						className={clsx(classes.handle, classes.targetHandle, {
							[classes.unusable]: unusable,
						})}
						type="target"
						id=":operator_target"
						isConnectable={!unusable}
						position={Position.Top}
					/>
					<Tooltip
						arrow
						TransitionComponent={Zoom}
						title={props.id}
						placement="right"
					>
						<img
							className={clsx(classes.nodeImg, {
								[classes.unusable]: unusable,
							})}
							src={src}
							draggable={false}
							onDragStart={(event) => {
								// Firefox
								event.preventDefault();
							}}
						/>
					</Tooltip>
					<Handle
						className={clsx(classes.handle, classes.sourceHandle, {
							[classes.unusable]: unusable,
						})}
						type="source"
						id=":operator_source"
						isConnectable={!unusable}
						position={Position.Bottom}
					/>
				</>
			);
		};
	}
	return nodeTypes;
};

export default getNodeTypes;
