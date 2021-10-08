import {
	useRef,
	useState,
	useEffect,
	Dispatch,
	DragEvent,
	MouseEvent,
	SetStateAction,
} from "react";

import { Snackbar, makeStyles } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";
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
import { useHistory, useParams } from "react-router-dom";

import {
	useGetWorkflow,
	useInfoOfWorkflow,
	useSetWorkflow,
} from "actions/workflowActions";
import { AddTooltip, Alert } from "components";
import { IWorkflow } from "interfaces";
import { platforms } from "utils";
import getEdgeTypes from "utils/edge/getEdgeTypes";
import getNodeTypes from "utils/node/getNodeTypes";
import * as nodeInitialData from "utils/node/nodeInitialData";
import { HomeParams } from "views/main/Home";
import ConfigurationDialog from "views/main/Home/DnDFlow/ConfigurationDialog";
import InfoTooltip from "views/main/Home/DnDFlow/InfoTooltip";
import TopBar from "views/main/Home/DnDFlow/Topbar";
import WorkflowName from "views/main/Home/DnDFlow/WorkflowName";

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

const DnDFlow = ({
	selectedEdgeCustomID,
	setSelectedEdgeCustomID,
	setOpenLog,
	setLoggedPodName,
}: {
	selectedEdgeCustomID: string;
	setSelectedEdgeCustomID: Dispatch<SetStateAction<string>>;
	setOpenLog: Dispatch<SetStateAction<boolean>>;
	setLoggedPodName: Dispatch<SetStateAction<string | undefined>>;
}): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();

	const { workflowID } = useParams<HomeParams>();
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
	const [counter, setCounter] = useState(0);
	const [configuredNode, setConfiguredNode] = useState<Node | null>(null);

	const { data: workflowData, isError: getWorkflowError } = useGetWorkflow();

	const nodes = workflowData?.property.nodes ?? [];
	const edges = workflowData?.property.edges ?? [];
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
	const [currentEdgeStatus, setCurrentEdgeStatus] = useState<
		| {
				displayName: string;
				isSeen: boolean;
				phase: string;
		  }
		| undefined
	>();
	const [enqueuedEdgeStatus, setEnqueuedEdgeStatus] = useState<
		{ displayName: string; isSeen: boolean; phase: string }[]
	>([]);
	const { data: statusData } = useInfoOfWorkflow(
		{
			argoWorkflowName,
			infoType: "status",
			enqueuedEdgeStatus,
			setEnqueuedEdgeStatus,
		},
		Boolean(argoWorkflowName)
	);
	useEffect(() => {
		const edgeStatusNotSeen = enqueuedEdgeStatus.find((node) => !node.isSeen);
		setCurrentEdgeStatus(
			edgeStatusNotSeen ? { ...edgeStatusNotSeen } : undefined
		);
	}, [enqueuedEdgeStatus]);

	useEffect(() => {
		if (selectedEdgeCustomID) {
			const currentEdgeStatus: any = Object.values(
				statusData?.nodes ?? {}
			).find((node: any) => node.displayName === selectedEdgeCustomID);
			setLoggedPodName(currentEdgeStatus?.id);
		}
	}, [selectedEdgeCustomID, statusData]);

	useEffect(() => {
		if (reactFlowInstance) {
			reactFlowInstance.fitView({ minZoom: -Infinity, maxZoom: 1 });
		}
	}, [nodes, reactFlowInstance]);

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
			let platformText;
			for (const platform of platforms) {
				for (const option of platform.options) {
					if (option.type === type) platformText = option.text;
				}
			}
			const newNode: Node = {
				id: platformText + "-" + counter,
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
	const onLoad = (reactFlowInstance: OnLoadParams) =>
		setReactFlowInstance(reactFlowInstance);
	const onNodeDragStop = (_event: MouseEvent, node: Node) => {
		const indexToUpdate = nodes.findIndex((option) => option.id === node.id);
		const newNodes = [...nodes];
		newNodes[indexToUpdate] = {
			...node,
		};
		setWorkflow({ property: { ...property, nodes: newNodes } });
	};
	const onElementClick = (_event: MouseEvent, element: Node | Edge) => {
		// Element is a node
		if ((element as Node).position) setConfiguredNode(element as Node);
		// Element is an edge
		else {
			setSelectedEdgeCustomID(
				(element as Edge).source + "-" + (element as Edge).target
			);
			setOpenLog(true);
		}
	};

	return (
		<>
			<TopBar
				nodes={nodes}
				edges={edges}
				setEnqueuedEdgeStatus={setEnqueuedEdgeStatus}
			/>
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
				{configuredNode && (
					<ConfigurationDialog
						configuredNode={configuredNode}
						setConfiguredNode={setConfiguredNode}
						nodes={nodes}
						edges={edges}
					/>
				)}
				<WorkflowName />
				<InfoTooltip />
				<AddTooltip
					onClick={() => {
						history.push({ pathname: "/home", state: { new: true } });
					}}
					title="New workflow"
				/>
			</div>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				autoHideDuration={2000}
				onClose={() => {
					if (currentEdgeStatus) {
						const currentEdgeStatusIndex = enqueuedEdgeStatus.findIndex(
							(edgeStatus) =>
								edgeStatus.displayName === currentEdgeStatus.displayName
						);
						const newEnqueuedEdgeStatus = [...enqueuedEdgeStatus];
						newEnqueuedEdgeStatus[currentEdgeStatusIndex] = {
							...currentEdgeStatus,
							isSeen: true,
						};

						setEnqueuedEdgeStatus(newEnqueuedEdgeStatus);
						setCurrentEdgeStatus(undefined);
					}
				}}
				open={Boolean(currentEdgeStatus)}
			>
				{currentEdgeStatus && (
					<MuiAlert
						severity={
							currentEdgeStatus?.phase === "Succeeded" ? "success" : "error"
						}
					>
						{currentEdgeStatus.displayName + " " + currentEdgeStatus.phase}
					</MuiAlert>
				)}
			</Snackbar>

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
