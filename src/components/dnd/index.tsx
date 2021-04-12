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
import 'react-notifications/lib/notifications.css';
import mouseImage from "../../assets/mouseclick.png"

import State from "../data/state";

import {nodeTypes} from "./nodes/nodegenerator";

const initialNodes: Elements | (() => Elements) = [];
const initialEdges: Elements | (() => Elements) = [];
let counter:number = 0;

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

const DnDFlow = () => {

    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [nodes, setNodes] = useState<Elements>(initialNodes);
    const [edges, setEdges] = useState<Elements>(initialEdges);
    const [showForm , setShowForm] = useState<string>("")

    const refS3 = useRef<HTMLDivElement>(null);
    const refKafka = useRef<HTMLDivElement>(null);
    const refES = useRef<HTMLDivElement>(null);

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
        console.log(event);
        if (reactFlowInstance) {
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({x: event.clientX, y: event.clientY - 40});
            const newNode: Node = {
                id: `${type}`,
                type,
                position,
                data: {label: `${type}`},
            };
            counter++;
            setNodes((es) => es.concat(newNode));
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
                }
                return newState
            } );
        }

    };

    return (
        <div className="dndflow" onContextMenu={(e)=> e.preventDefault()}>
            <ReactFlowProvider >
                <Sidebar/>
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
                {! (showForm !== "") &&
                <div className={"form-div"} >
                    <label className={"form-label"}>No Configuration Selected</label>
                    <img className={"mouse-image"} src={mouseImage} alt={""}/>
                    <label className={"form-label"}>Please Right Click on Any Node on Canvas to Activate Configuration Panel</label>
                </div>}
                {(showForm === "S3") && <S3Form ref={refS3}/>}
                {(showForm === "Kafka") && <KafkaForm ref={refKafka}/>}
                {(showForm === "Elasticsearch") && <ESForm ref={refES}/>}
            </div>
        </div>
    );
};

export default DnDFlow;