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
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import {
	useGetWorkflow,
	useInfoOfWorkflow,
	useSetWorkflow,
} from "actions/workflowActions";
import { Alert } from "components";
import { IWorkflow } from "interfaces";
import getEdgeTypes from "utils/edge/getEdgeTypes";
import getNodeTypes from "utils/node/getNodeTypes";
import * as nodeInitialData from "utils/node/nodeInitialData";
import { HomeParams } from "views/main/Home";
import AddTooltip from "views/main/Home/DnDFlow/AddTooltip";
import FormManager from "views/main/Home/DnDFlow/FormManager";
import InfoTooltip from "views/main/Home/DnDFlow/InfoTooltip";
import TopBar from "views/main/Home/DnDFlow/Topbar";
import WorkflowName from "views/main/Home/DnDFlow/WorkflowName";

// import useLastworkflowID from "views/main/home/useLastworkflowID"; Not used right now

const useStyles = makeStyles((theme) => ({
	reactFlowWrapper: { height: "calc(100% - 40px)", position: "relative" }, // Subtract topbar's height
	controls: {
		"& > *": {
			backgroundColor: theme.palette.secondary.main,
			borderBottom: "none",
		},
		"& > *:hover": {
			backgroundColor: theme.palette.action.hover,
		},
		border: `1px solid ${theme.palette.secondary.main}`,
		borderRadius: theme.shape.borderRadius,
	},
}));

const nodeTypes = getNodeTypes();
const edgeTypes = getEdgeTypes();

const onDragOver = (event: DragEvent) => {
	const isReactFlowElement = event.dataTransfer.types.includes(
		"application/reactflow"
	);
	if (isReactFlowElement) event.preventDefault();
	event.dataTransfer.dropEffect = "move";
};

const DnDFlow = (): JSX.Element => {
	const classes = useStyles();

	const { workflowID } = useParams<HomeParams>();
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
	const [counter, setCounter] = useState(0);
	const [configuredNode, setConfiguredNode] = useState<Node | null>(null);

	const { data, isError: getWorkflowError } = useGetWorkflow(
		Boolean(workflowID)
	);

	const nodes = data?.property.nodes ?? [];
	const edges = data?.property.edges ?? [];
	const property = { nodes, edges };
	const { isError: setWorkflowError, mutate: setWorkflow } = useSetWorkflow();

	useEffect(() => {
		let max = -1;
		for (const node of nodes) {
			const id = node.id.split("-")[1];
			if (Number(id) > max) max = Number(id);
		}
		setCounter(max + 1);
	}, [nodes]);

	const queryClient = useQueryClient();
	const currentWorkflow = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	]);
	const argoWorkflowName = currentWorkflow?.argoWorkflowName ?? "";
	useInfoOfWorkflow(
		{ argoWorkflowName, infoType: "status" },
		Boolean(argoWorkflowName)
	);

	const onConnect = (params: Edge | Connection) => {
		(params as Edge).animated = false;
		(params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;

		const newEdges = addEdge({ ...params }, edges);
		setWorkflow({ property: { ...property, edges: newEdges } });
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
			setWorkflow({ property: { ...property, nodes: newNodes } });
		}
	};
	const onElementsRemove = (elementsToRemove: Elements) => {
		const newNodes = removeElements(elementsToRemove, nodes);
		const newEdges = removeElements(elementsToRemove, edges);
		if (elementsToRemove.some((element) => element.id === configuredNode?.id))
			setConfiguredNode(null);
		setWorkflow({ property: { nodes: newNodes, edges: newEdges } });
	};
	const onLoad = (_reactFlowInstance: OnLoadParams) =>
		setReactFlowInstance(_reactFlowInstance);
	const onNodeDragStop = (_event: MouseEvent, node: Node) => {
		const indexToUpdate = nodes.findIndex((option) => option.id === node.id);
		const newNodes = [...nodes];
		newNodes[indexToUpdate] = {
			...node,
		};
		setWorkflow({ property: { ...property, nodes: newNodes } });
	};
	const onElementClick = (_event: MouseEvent, element: Node | Edge) => {
		//Element is a node
		if ((element as Node).position) setConfiguredNode(element as Node);
	};
	return (
		<>
			<TopBar nodes={nodes} edges={edges} />
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
					edgeTypes={edgeTypes}
					selectNodesOnDrag={false}
				>
					<Controls className={classes.controls} />
				</ReactFlow>
				<FormManager
					configuredNode={configuredNode}
					setConfiguredNode={setConfiguredNode}
					nodes={nodes}
					edges={edges}
				/>
				<WorkflowName />
				<InfoTooltip />
				<AddTooltip />
			</div>
			{getWorkflowError && (
				<Alert
					message="An error occured while fetching the workflow!"
					severity="error"
				/>
			)}
			{setWorkflowError && (
				<Alert
					message="An error occured while saving the workflow!"
					severity="error"
				/>
			)}
		</>
	);
};

export default DnDFlow;
