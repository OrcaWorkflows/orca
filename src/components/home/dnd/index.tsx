import React, {DragEvent, useEffect, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    ArrowHeadType, Connection, ControlButton,
    Controls,
    Edge,
    Elements, Node,
    OnLoadParams,
    ReactFlowProvider,
    removeElements,
} from 'react-flow-renderer';

import Sidebar from './sidebar';
import TopBar from './topbar';

import './scss/dnd.css';
import './scss/nodes.scss'
import S3Form from "../nodeforms/s3";
import KafkaForm from "../nodeforms/kafka";
import ESForm from "../nodeforms/elasticsearch";
import SystemForm from "../nodeforms/system";
import 'react-notifications/lib/notifications.css';
import mouseImage from "../../../assets/mouseclick.png";
import { SaveOutlined, DownloadOutlined } from '@ant-design/icons';

import {State, NodeConf} from "../../data/state";

import {nodeTypes} from "./nodes/nodegenerator";
import DefaultForm from "../nodeforms/default";
import {SEPARATOR} from "../../../index";
import SideHeader from "../../navigation/sideheader";
import PubSubForm from "../nodeforms/pubsub";
import {getCanvas, setCanvas} from "../../../actions/canvas_actions";
import {Button, IconButton} from "@material-ui/core";
import {Save} from "@material-ui/icons";
import {NotificationManager} from "react-notifications";
import {notificationTimeoutMillis} from "../../../config";
import BigQueryForm from "../nodeforms/bigquery";


let initialNodes: Elements | (() => Elements) = [];
let initialEdges: Elements | (() => Elements) = [];

// eslint-disable-next-line
let counter:number = 0;

const implementedNodes:Array<string> = ["S3", "Elasticsearch", "Kafka", "PubSub", "BigQuery"];

const DnDFlow = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [nodes, setNodes] = useState<Elements>(initialNodes);
    const [edges, setEdges] = useState<Elements>(initialEdges);
    const [showForm , setShowForm] = useState<string>("");
    const [activeTab, setActiveTab] = useState("Configurations");

    const refS3 = useRef<HTMLDivElement>(null);
    const refKafka = useRef<HTMLDivElement>(null);
    const refES = useRef<HTMLDivElement>(null);
    const refPubSub = useRef<HTMLDivElement>(null);
    const refBigQueryForm = useRef<HTMLDivElement>(null);
    const refDefaultForm = useRef(null);

    useEffect(() => {
        getCanvas().then(r => {
            localStorage.setItem("canvasID", JSON.stringify(r.id));
            localStorage.setItem("nodes", JSON.stringify(r.property.nodes));
            localStorage.setItem("edges", JSON.stringify(r.property.edges));
            console.log("Nodes set, ", r.property.nodes);
            setNodes(r.property.nodes);
            setEdges(r.property.edges);
    });},[]);

    const onConnect = (params: Edge | Connection) => {
        (params as Edge).animated = true;
        (params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;
        setEdges((edges) => addEdge(params, edges));
    }

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onElementsRemove = (elementsToRemove: Elements) => {
        setNodes((nodes) => removeElements(elementsToRemove, nodes));
        setEdges((edges) => removeElements(elementsToRemove, edges));
    }

    const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        if (reactFlowInstance) {
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({x: event.clientX - 330, y: event.clientY - 140});
            const newNode: Node = {
                id: `${type}` + SEPARATOR + counter,
                type,
                position,
                data: {label: `${type}`},
            };
            counter++;
            setNodes((es) => es.concat(newNode));
        }
    };
    const handleClick = (element: any) => {
        if (element.target.nextElementSibling != null){
            const node_type = element.target.nextElementSibling.dataset.nodeid;
            setShowForm((prevShowForm:string) => {
                let newState = ""
                if(prevShowForm !== node_type){
                    newState = node_type;
                    State.currentNodeClick = node_type;
                }
                return newState
            } );
        }
    };

    const onNodeDragStop = (event: React.MouseEvent, node:Node) => {
        event.preventDefault();
        nodes.forEach(
            (element) => {
           if (element.id === node.id) {
               (element as Node).position.x = event.clientX - 330;
               (element as Node).position.y = event.clientY - 140;
           }
        });
        setCanvas(nodes, edges);
    }
    const saveWorkflow = () => {
        // setNodes(JSON.parse(localStorage.getItem("nodes") as string) as Elements);
        setCanvas(nodes, edges);
        NotificationManager.success('Successfully Saved Workflow', 'Success', notificationTimeoutMillis);
    }
    const openTab = (opName:any) => {
        setActiveTab(opName);
    }
    return (
            <div className="dndflow" onContextMenu={(e)=> e.preventDefault()}>
                <ReactFlowProvider >
                    <div style={{display: "flex"}}>
                        <SideHeader/>
                        <Sidebar/>
                    </div>

                    <div className="reactflow-wrapper">
                        <TopBar/>
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
                        <button className={activeTab === "Configurations" ? "tablinks active" : "tablinks"}  onClick={() => openTab('Configurations')} >Configurations</button>
                        <button className={activeTab === "System" ? "tablinks active" : "tablinks"} onClick={() => openTab('System')}>System</button>
                        <button className={activeTab === "Details" ? "tablinks active" : "tablinks"} onClick={() => openTab('Details')}>Details</button>
                    </div>

                    {activeTab === "Configurations" && <div>
                        {! (showForm !== "") &&
                        <div className={"form-div"} >
                            <label className={"form-label"}>No Configuration Selected</label>
                            <img className={"mouse-image"} src={mouseImage} alt={""}/>
                            <label className={"form-label"}>Please Right Click on Any Node on Canvas to Activate Configuration Panel</label>
                        </div>}
                        {(showForm.indexOf("S3") >= 0) && <S3Form ref={refS3} nodes={nodes} setNodes={setNodes}/>}
                        {(showForm.indexOf("Kafka") >= 0) && <KafkaForm ref={refKafka} nodes={nodes} setNodes={setNodes}/>}
                        {(showForm.indexOf("Elasticsearch") >= 0) && <ESForm ref={refES} nodes={nodes} setNodes={setNodes}/>}
                        {(showForm.indexOf("PubSub") >= 0) && <PubSubForm ref={refPubSub} nodes={nodes} setNodes={setNodes}/>}
                        {(showForm.indexOf("BigQuery") >= 0) && <BigQueryForm ref={refBigQueryForm} nodes={nodes} setNodes={setNodes}/>}
                        {(showForm !== "" && implementedNodes.indexOf(showForm.split(SEPARATOR)[0]) === -1) && <DefaultForm ref={refDefaultForm}/>}
                    </div>}
                    {activeTab === "System" && <div className={"tabchild"}>
                        <SystemForm/>
                    </div>}

                    {activeTab === "Details" && <div className={"tabchild"}>
                        <h3>Details</h3>
                        <p>Details.</p>
                    </div>}
                </div>
            </div>
    );
};

export default DnDFlow;