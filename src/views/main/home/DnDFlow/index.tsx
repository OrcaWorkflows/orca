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
import { HomeParams } from "views/main/home";
import AddTooltip from "views/main/home/DnDFlow/AddTooltip";
import FormManagement from "views/main/home/DnDFlow/FormManagement";
import InfoTooltip from "views/main/home/DnDFlow/InfoTooltip";
import TopBar from "views/main/home/DnDFlow/Topbar";
import getNodeTypes from "views/main/home/node/getNodeTypes";
import * as nodeInitialData from "views/main/home/node/nodeInitialData";
// import useLastCanvasId from "views/main/home/useLastCanvasId"; Not used right now

const useStyles = makeStyles((theme) => ({
	reactFlowWrapper: { height: "calc(100% - 40px)", position: "relative" }, // Subtract topbar's height
	controls: {
		"& > *": { backgroundColor: theme.palette.secondary.main },
		border: `2px solid ${theme.palette.secondary.dark}`,
		borderRadius: theme.shape.borderRadius,
	},
}));

const nodeTypes = getNodeTypes();

const onDragOver = (event: DragEvent) => {
	const isReactFlowElement = event.dataTransfer.types.includes(
		"application/reactflow"
	);
	if (isReactFlowElement) event.preventDefault();
	event.dataTransfer.dropEffect = "move";
};

function getCanvasId() {
	return JSON.parse(localStorage.getItem("lastCanvasId") as string);
}

const DnDFlow = (): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();
	const { canvasID } = useParams<HomeParams>();
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
	const [counter, setCounter] = useState(0);
	const [configuredNode, setConfiguredNode] = useState<Node | null>(null);

	const {
		isError: getCanvasError,
		nodes = [],
		edges = [],
		workflowName,
	} = useGetCanvas(Number(canvasID), Boolean(canvasID));

	const id = Number(canvasID);
	const property = { nodes, edges };
	const { isError: setCanvasError, mutate: setCanvas } = useSetCanvas();

	const lastCanvasId = getCanvasId();
	useEffect(() => {
		if (!canvasID) {
			if (lastCanvasId) history.replace(`/home/${lastCanvasId}`);
			else setCanvas({ id, property });
		}
	}, [lastCanvasId]); // lastCanvasId can be used it as dep directly as it gets updated just before rerender

	useEffect(() => {
		let max = -1;
		for (const node of nodes) {
			const id = node.id.split("-")[1];
			if (Number(id) > max) max = Number(id);
		}
		setCounter(max + 1);
	}, [nodes]);

	const onConnect = (params: Edge | Connection) => {
		(params as Edge).animated = true;
		(params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;

		const newEdges = addEdge(params, edges);
		setCanvas({ id, property: { ...property, edges: newEdges } });
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
				id: type + "-" + counter,
				type,
				position,
				data: { ...nodeInitialData[type as keyof typeof nodeInitialData] },
			};

			const newNodes = nodes.concat(newNode);
			setCanvas({ id, property: { ...property, nodes: newNodes } });
		}
	};
	const onElementsRemove = (elementsToRemove: Elements) => {
		const newNodes = removeElements(elementsToRemove, nodes);
		const newEdges = removeElements(elementsToRemove, edges);
		if (elementsToRemove.some((element) => element.id === configuredNode?.id))
			setConfiguredNode(null);
		setCanvas({ id, property: { nodes: newNodes, edges: newEdges } });
	};
	const onLoad = (_reactFlowInstance: OnLoadParams) =>
		setReactFlowInstance(_reactFlowInstance);
	const onNodeDragStop = (_event: MouseEvent, node: Node) => {
		const indexToUpdate = nodes.findIndex((option) => option.id === node.id);
		const newNodes = [...nodes];
		newNodes[indexToUpdate] = {
			...node,
		};
		setCanvas({ id, property: { ...property, nodes: newNodes } });
	};
	const onElementClick = (_event: MouseEvent, element: Node | Edge) => {
		//Element is a node
		if (element.data) setConfiguredNode(element as Node);
	};
	return (
		<>
			<TopBar nodes={nodes} edges={edges} workflowName={workflowName} />
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
					<Controls className={classes.controls} />
				</ReactFlow>
				<FormManagement
					configuredNode={configuredNode}
					setConfiguredNode={setConfiguredNode}
					nodes={nodes}
					edges={edges}
				/>
				<InfoTooltip />
				<AddTooltip />
			</div>
			{getCanvasError && (
				<Alert
					message="An error occured while fetching the canvas!"
					severity="error"
				/>
			)}
			{setCanvasError && (
				<Alert
					message="An error occured while saving the canvas!"
					severity="error"
				/>
			)}
		</>
	);
};

export default DnDFlow;
