import { FunctionComponent } from "react";

import { Tooltip, Zoom, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
	// Connection,
	// Edge,
	Elements,
	Handle,
	NodeProps,
	Position,
} from "react-flow-renderer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { HomeParams } from "views/main/home";
import { supportedPlatforms } from "views/main/home/DnDFlow/FormManagement";
import * as nodeImages from "views/main/home/node/nodeImages";
import useValidateNodes from "views/main/home/workflow/useValidateNodes";

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
	nodeImg: (props: { selected: boolean }) => ({
		border: props.selected
			? `2px solid ${theme.palette.secondary.dark}`
			: "unset",
		borderRadius: theme.shape.borderRadius,
		cursor: "pointer",
		height: props.selected ? 48 : 36,
		margin: 5,
		padding: props.selected ? 4 : "unset",
	}),
	unusable: {
		WebkitFilter: "grayscale(100%)" /* Safari 6.0 - 9.0 */,
		filter: "grayscale(100%)",
	},
}));

const getNodeTypes = (): nodeTypes => {
	const nodeTypes: nodeTypes = {};
	let node: keyof typeof nodeImages;
	for (node in nodeImages) {
		const src = nodeImages[node];

		nodeTypes[node] = function Node(props) {
			const classes = useStyles({ selected: props.selected });
			const { canvasID } = useParams<HomeParams>();
			const queryClient = useQueryClient();
			const canvas = queryClient.getQueryData<{
				createdAt: number;
				id: number;
				property: { nodes: Elements; edges: Elements };
				updatedAt: number;
				workflowName: string | null;
			}>(["canvas", Number(canvasID)]);
			const nodes = canvas?.property.nodes;
			const [nodeValidationErrors] = useValidateNodes(nodes ?? []);
			const unusable =
				!!nodeValidationErrors[props.id] ||
				!supportedPlatforms.includes(props.type);
			return (
				<>
					<Handle
						className={clsx(classes.handle, classes.targetHandle, {
							[classes.unusable]: unusable,
						})}
						type="target"
						id="operator_target"
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
						/>
					</Tooltip>
					<Handle
						className={clsx(classes.handle, classes.sourceHandle, {
							[classes.unusable]: unusable,
						})}
						type="source"
						id="operator_source"
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
