import { useRef, useState, useEffect, DragEvent, MouseEvent } from "react";

import { makeStyles } from "@material-ui/core";
import ReactFlow, {
	addEdge,
	removeElements,
	ArrowHeadType,
	Connection,
	Controls,
	Edge,
	Elements,
	Node,
	OnLoadParams,
} from "react-flow-renderer";
import { useHistory, useParams } from "react-router-dom";

import { useGetCanvas, useSetCanvas } from "actions/canvasActions";
import { Alert } from "components";
import { useUpdateEffect } from "hooks";
import { SEPARATOR } from "utils/utils";
import FormManagement from "views/main/home/DnDFlow/FormManagement";
import TopBar from "views/main/home/DnDFlow/Topbar";
import getNodeTypes from "views/main/home/nodes/getNodeTypes";
// import useLastCanvasId from "views/main/home/useLastCanvasId"; Not used right now

const useStyles = makeStyles(() => ({
	reactFlowWrapper: { height: "calc(100% - 40px)" }, // Subtract topbar's height
}));

const nodeTypes = getNodeTypes();

const onDragOver = (event: DragEvent) => {
	event.preventDefault();
	event.dataTransfer.dropEffect = "move";
};

export type HomeParams = {
	canvasId: string;
};
function getCanvasId() {
	return JSON.parse(localStorage.getItem("lastCanvasId") as string);
}

const DnDFlow = (): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();
	const { canvasId } = useParams<HomeParams>();
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
	const [counter, setCounter] = useState(0);
	const [nodes, setNodes] = useState<Elements>([]);
	const [edges, setEdges] = useState<Elements>([]);
	const [configuredNode, setConfiguredNode] = useState<Node | null>(null);

	const lastCanvasId = getCanvasId();
	useEffect(() => {
		if (!canvasId && lastCanvasId) {
			history.replace(`/home/${lastCanvasId}`);
		}
	}, [lastCanvasId]); // lastCanvasId Can be used it as dep directly as it gets updated just before rerender

	const { isError: getCanvasError } = useGetCanvas(
		Number(canvasId),
		setEdges,
		setNodes,
		setCounter,
		Boolean(canvasId)
	);

	const { isError: setCanvasError, mutate: setCanvas } = useSetCanvas();
	useUpdateEffect(() => {
		const id = Number(canvasId);
		const property = { edges, nodes };
		setCanvas({ id, property });
	}, [edges, nodes]);

	const onConnect = (params: Edge | Connection) => {
		(params as Edge).animated = true;
		(params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;
		setEdges((edges) => addEdge(params, edges));
	};
	const onDrop = (event: DragEvent) => {
		event.preventDefault();
		if (reactFlowInstance && reactFlowWrapper.current) {
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData("application/reactflow");
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const newNode: Node = {
				id: type + SEPARATOR + counter,
				type,
				position,
				data: { label: `${type + SEPARATOR + counter}` },
			};
			setCounter(counter + 1);
			setNodes((nodes) => nodes.concat(newNode));
		}
	};
	const onElementsRemove = (elementsToRemove: Elements) => {
		setNodes((nodes) => removeElements(elementsToRemove, nodes));
		setEdges((edges) => removeElements(elementsToRemove, edges));
	};
	const onLoad = (_reactFlowInstance: OnLoadParams) =>
		setReactFlowInstance(_reactFlowInstance);
	const onNodeDragStop = (_: MouseEvent, node: Node) => {
		const indexToUpdate = nodes.findIndex((option) => option.id === node.id);
		const newNodes = [...nodes];
		newNodes[indexToUpdate] = {
			...node,
		};
		setNodes(newNodes);
	};
	const onElementClick = (_: MouseEvent, element: Node | Edge) => {
		setConfiguredNode(element as Node);
	};

	return (
		<>
			<TopBar nodes={[]} edges={[]} />
			<div className={classes.reactFlowWrapper} ref={reactFlowWrapper}>
				<ReactFlow
					elements={nodes.concat(edges)}
					onConnect={onConnect}
					onDragOver={onDragOver}
					onDrop={onDrop}
					onElementClick={onElementClick}
					onElementsRemove={onElementsRemove}
					onLoad={onLoad}
					onNodeDragStop={onNodeDragStop}
					nodeTypes={nodeTypes}
					selectNodesOnDrag={false}
				>
					<Controls />
				</ReactFlow>
				<FormManagement
					configuredNode={configuredNode}
					setConfiguredNode={setConfiguredNode}
					nodes={nodes}
					setNodes={setNodes}
					edges={edges}
				/>
			</div>
			{getCanvasError && (
				<Alert
					message="An error occured while fetching the canvas data!"
					severity="error"
				/>
			)}
			{setCanvasError && (
				<Alert
					message="An error occured while saving the canvas data!"
					severity="error"
				/>
			)}
		</>
	);
};

export default DnDFlow;
