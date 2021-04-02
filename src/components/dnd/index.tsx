import React, {DragEvent, useState} from 'react';
import ReactFlow, {
    addEdge,
    ArrowHeadType, Connection,
    Controls,
    Edge,
    Elements,
    Node,
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
            const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
            const newNode: Node = {
                id: `${type}`,
                type,
                position,
                data: { label: `${type}` },
            };

            setElements((es) => es.concat(newNode));
        }
    };

    const nodeTypes = {
        S3: S3,
        Kafka: KAFKA,
        Elasticsearch: ELASTICSEARCH,
    };

    return (
        <div className="dndflow">
            <ReactFlowProvider>
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
                    >
                    <Controls />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default DnDFlow;