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

import './dnd.css';
import S3 from "../nodes/S3";
import KAFKA from "../nodes/KAFKA";
import ELASTICSEARCH from "../nodes/ELASTICSEARCH";
import S3Form from "../nodeforms/s3";
import KafkaForm from "../nodeforms/kafka";
import ESForm from "../nodeforms/elasticsearch";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


const initialElements: Elements | (() => Elements) = [];

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

const DnDFlow = () => {

    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState<Elements>(initialElements);

    const onConnect = (params: Edge | Connection) => {
        (params as Edge).animated = true;
        (params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;
        setElements((elements) => addEdge(params, elements));
    }
    console.log(elements);
    const onElementsRemove = (elementsToRemove: Elements) => setElements((elements) => removeElements(elementsToRemove, elements));
    const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);

    const onDrop = (event: DragEvent) => {
        event.preventDefault();

        if (reactFlowInstance) {
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({x: event.clientX, y: event.clientY - 40});
            const newNode: Node = {
                id: `${type}`,
                type,
                position,
                data: {label: `${type}`},
            };

            setElements((es) => es.concat(newNode));
        }
    };

    const nodeTypes = {
        S3: S3,
        Kafka: KAFKA,
        Elasticsearch: ELASTICSEARCH,
    };

    const refS3 = useRef<HTMLDivElement>(null);
    const refKafka = useRef<HTMLDivElement>(null);
    const refES = useRef<HTMLDivElement>(null);

    const handleClick = (element: any) => {
        const nodeS3 = refS3.current as any;
        const nodeKafka = refKafka.current as any;
        const nodeES = refES.current as any;
        console.log(element);
        if (element.target.nextElementSibling != null){
            const node_type = element.target.nextElementSibling.dataset.nodeid;
            if (node_type === "S3") {
                nodeS3.showS3Form();
                nodeKafka.hideKafkaForm();
                nodeES.hideEsForm();
            } else if (node_type === "Kafka") {
                nodeKafka.showKafkaForm();
                nodeS3.hideS3Form();
                nodeES.hideEsForm();
            } else if (node_type === "Elasticsearch") {
                nodeES.showESForm();
                nodeKafka.hideKafkaForm();
                nodeS3.hideS3Form();
            }
        }
        NotificationManager.success('Successfully Saved Configurations', 'Success');
    };

    return (
        <div className="dndflow" onContextMenu={(e)=> e.preventDefault()}>
            <ReactFlowProvider >
                <Sidebar/>
                <div className="reactflow-wrapper">
                    <TopBar/>
                    <ReactFlow
                        elements={elements}
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
            <S3Form ref={refS3}/>
            <KafkaForm ref={refKafka}/>
            <ESForm ref={refES}/>
            <NotificationContainer/>
        </div>
    );
};

export default DnDFlow;