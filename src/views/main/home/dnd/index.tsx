import { DragEvent, useEffect, useRef, useState } from "react";

import { Save } from "@material-ui/icons";
import ReactFlow, {
	addEdge,
	ArrowHeadType,
	Connection,
	ControlButton,
	Controls,
	Edge,
	Elements,
	Node,
	OnLoadParams,
	ReactFlowProvider,
	removeElements,
} from "react-flow-renderer";
import { NotificationManager } from "react-notifications";

import "./scss/dnd.css";
import "./scss/nodes.scss";
import "react-notifications/lib/notifications.css";

import { getCanvas, setCanvas } from "../../../../actions/canvas_actions";
import mouseImage from "../../../../assets/mouseclick.png";
import { notificationTimeoutMillis } from "../../../../config";
import { SEPARATOR } from "../../../../index";
import SideHeader from "../../navigation/sideheader";
import BigQueryForm from "../nodeforms/bigquery";
import DefaultForm from "../nodeforms/default";
import ESForm from "../nodeforms/elasticsearch";
import EMRForm from "../nodeforms/emr";
import KafkaForm from "../nodeforms/kafka";
import PubSubForm from "../nodeforms/pubsub";
import S3Form from "../nodeforms/s3";
import SystemForm from "../nodeforms/system";
import { nodeTypes } from "./nodes/nodegenerator";
import Sidebar from "./sidebar";
import TopBar from "./topbar";

const initialNodes: Elements | (() => Elements) = [];
const initialEdges: Elements | (() => Elements) = [];

const implementedNodes: Array<string> = [
	"S3",
	"EMR",
	"Elasticsearch",
	"Kafka",
	"PubSub",
	"BigQuery",
];

const DnDFlow = () => {
	const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
	const [nodes, setNodes] = useState<Elements>(initialNodes);
	const [edges, setEdges] = useState<Elements>(initialEdges);
	const [showForm, setShowForm] = useState<string>("");
	const [activeTab, setActiveTab] = useState("Configurations");
	const [counter, setCounter] = useState<number>(0);

	const refHtml = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getCanvas().then((r) => {
			localStorage.setItem("canvasID", JSON.stringify(r.id));
			localStorage.setItem("nodes", JSON.stringify(r.property.nodes));
			localStorage.setItem("edges", JSON.stringify(r.property.edges));
			setNodes(r.property.nodes);
			setEdges(r.property.edges);
			setCounter(r.property.nodes.length);
		});
	}, []);

	const onConnect = (params: Edge | Connection) => {
		(params as Edge).animated = true;
		(params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;
		setEdges((edges) => addEdge(params, edges));
	};

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};

	const onElementsRemove = (elementsToRemove: Elements) => {
		setNodes((nodes) => removeElements(elementsToRemove, nodes));
		setEdges((edges) => removeElements(elementsToRemove, edges));
	};

	const onLoad = (_reactFlowInstance: OnLoadParams) =>
		setReactFlowInstance(_reactFlowInstance);

	const onDrop = (event: DragEvent) => {
		event.preventDefault();
		if (reactFlowInstance) {
			const type = event.dataTransfer.getData("application/reactflow");
			const position = reactFlowInstance.project({
				x: event.clientX - 330,
				y: event.clientY - 140,
			});
			const newNode: Node = {
				id: `${type}` + SEPARATOR + counter,
				type,
				position,
				data: { label: `${type}` },
			};
			setCounter(counter + 1);
			setNodes((es) => es.concat(newNode));
		}
	};
	const handleClick = (element: any) => {
		if (element.target.nextElementSibling != null) {
			const node_type = element.target.nextElementSibling.dataset.nodeid;
			setShowForm((prevShowForm: string) => {
				let newState = "";
				if (prevShowForm !== node_type) {
					newState = node_type;
					localStorage.setItem("currentNodeClick", node_type);
				}
				return newState;
			});
		}
	};

	const onNodeDragStop = (event: React.MouseEvent, node: Node) => {
		event.preventDefault();
		nodes.forEach((element) => {
			if (element.id === node.id) {
				(element as Node).position.x = event.clientX - 330;
				(element as Node).position.y = event.clientY - 140;
			}
		});
		setCanvas(nodes, edges);
	};
	const saveWorkflow = () => {
		setCanvas(nodes, edges);
		NotificationManager.success(
			"Successfully Saved Workflow",
			"Success",
			notificationTimeoutMillis
		);
	};
	const openTab = (opName: any) => {
		setActiveTab(opName);
	};
	return (
		<div className="dndflow" onContextMenu={(e) => e.preventDefault()}>
			<ReactFlowProvider>
				<div style={{ display: "flex" }}>
					<SideHeader />
					<Sidebar />
				</div>

				<div className="reactflow-wrapper">
					<TopBar nodes={nodes} edges={edges} />
					<ReactFlow
						elements={nodes.concat(edges)}
						onConnect={onConnect}
						onElementsRemove={onElementsRemove}
						onLoad={onLoad}
						onDrop={onDrop}
						onDragOver={onDragOver}
						nodeTypes={nodeTypes}
						onContextMenu={handleClick}
						onNodeDragStop={onNodeDragStop}
					>
						<Controls>
							<ControlButton onClick={saveWorkflow}>
								<Save />
							</ControlButton>
						</Controls>
					</ReactFlow>
				</div>
			</ReactFlowProvider>
			<div className={"forms"}>
				<div className="tab">
					<button
						className={
							activeTab === "Configurations" ? "tablinks active" : "tablinks"
						}
						onClick={() => openTab("Configurations")}
					>
						Configurations
					</button>
					<button
						className={activeTab === "System" ? "tablinks active" : "tablinks"}
						onClick={() => openTab("System")}
					>
						System
					</button>
					<button
						className={activeTab === "Details" ? "tablinks active" : "tablinks"}
						onClick={() => openTab("Details")}
					>
						Details
					</button>
				</div>

				{activeTab === "Configurations" && (
					<div>
						{!(showForm !== "") && (
							<div className={"form-div"}>
								<label className={"form-label"}>
									No Configuration Selected
								</label>
								<img className={"mouse-image"} src={mouseImage} alt={""} />
								<label className={"form-label"}>
									Please Right Click on Any Node on Canvas to Activate
									Configuration Panel
								</label>
							</div>
						)}
						{showForm.indexOf("S3") >= 0 && (
							<S3Form
								ref={refHtml}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
							/>
						)}
						{showForm.indexOf("EMR") >= 0 && (
							<EMRForm
								ref={refHtml}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
							/>
						)}
						{showForm.indexOf("Kafka") >= 0 && (
							<KafkaForm
								ref={refHtml}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
							/>
						)}
						{showForm.indexOf("Elasticsearch") >= 0 && (
							<ESForm
								ref={refHtml}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
							/>
						)}
						{showForm.indexOf("PubSub") >= 0 && (
							<PubSubForm
								ref={refHtml}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
							/>
						)}
						{showForm.indexOf("BigQuery") >= 0 && (
							<BigQueryForm
								ref={refHtml}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
							/>
						)}
						{showForm !== "" &&
							implementedNodes.indexOf(showForm.split(SEPARATOR)[0]) === -1 && (
								<DefaultForm ref={refHtml} />
							)}
					</div>
				)}
				{activeTab === "System" && (
					<div className={"tabchild"}>
						<SystemForm />
					</div>
				)}

				{activeTab === "Details" && (
					<div className={"tabchild"}>
						<h3>Details</h3>
						<p>Details.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DnDFlow;
