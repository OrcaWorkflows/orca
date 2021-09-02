import { makeStyles } from "@material-ui/core";
import ReactFlow, { OnLoadParams } from "react-flow-renderer";

import { IWorkflow } from "interfaces";
import getNodeTypes from "utils/node/getNodeTypes";

const useStyles = makeStyles(() => ({
	reactFlowWrapper: { width: 300, height: 200, position: "relative" },
}));

const nodeTypes = getNodeTypes();

const Flow = ({ workflow }: { workflow: IWorkflow }): JSX.Element => {
	const classes = useStyles();

	const onLoad = (reactFlowInstance: OnLoadParams) => {
		reactFlowInstance.fitView({ minZoom: -Infinity, maxZoom: 0.5 });
	};

	return (
		<div className={classes.reactFlowWrapper}>
			<ReactFlow
				elements={workflow.property.nodes.concat(workflow.property.edges)}
				elementsSelectable={false}
				onLoad={onLoad}
				nodeTypes={nodeTypes}
				nodesDraggable={false}
				nodesConnectable={false}
				paneMoveable={false}
				zoomOnPinch={false}
				zoomOnScroll={false}
				zoomOnDoubleClick={false}
				preventScrolling={false}
			/>
		</div>
	);
};

export default Flow;
