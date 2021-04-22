import React, {DragEvent, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    ArrowHeadType, Connection,
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


import {State, NodeConf} from "../../data/state";

import {nodeTypes} from "./nodes/nodegenerator";
import DefaultForm from "../nodeforms/default";
import {SEPERATOR} from "../../../index";
import SideHeader from "../../navigation/sideheader";

const initialNodes: Elements | (() => Elements) = [];
const initialEdges: Elements | (() => Elements) = [];
// eslint-disable-next-line
let counter:number = 0;

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

const implementedNodes:Array<string> = ["S3", "Elasticsearch", "Kafka"];

const DnDFlow = () => {

    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [nodes, setNodes] = useState<Elements>(initialNodes);
    const [edges, setEdges] = useState<Elements>(initialEdges);
    const [showForm , setShowForm] = useState<string>("");
    const [activeTab, setActiveTab] = useState("Configurations");

    const refS3 = useRef<HTMLDivElement>(null);
    const refKafka = useRef<HTMLDivElement>(null);
    const refES = useRef<HTMLDivElement>(null);
    const refDefaultForm = useRef(null);

    const onConnect = (params: Edge | Connection) => {
        console.log(params);
        (params as Edge).animated = true;
        (params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;
        setEdges((edges) => addEdge(params, edges));
    }

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
                id: `${type}` + SEPERATOR + counter,
                type,
                position,
                data: {label: `${type}`},
            };
            counter++;
            setNodes((es) => es.concat(newNode));
            let nodeConf:NodeConf = {
                id: newNode.id
            }
            State.nodeConfList.push(nodeConf);
        }
    };

    State.edges = edges;
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
                        >
                            <Controls/>
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
                        {(showForm.indexOf("S3") >= 0) && <S3Form ref={refS3}/>}
                        {(showForm.indexOf("Kafka") >= 0) && <KafkaForm ref={refKafka}/>}
                        {(showForm.indexOf("Elasticsearch") >= 0) && <ESForm ref={refES}/>}
                        {(showForm !== "" && implementedNodes.indexOf(showForm.split(SEPERATOR)[0]) === -1) && <DefaultForm ref={refDefaultForm}/>}
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