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
import 'react-notifications/lib/notifications.css';

import {Task} from "../data/interface";
import State from "../data/state";

const Read = "Read";
const Write = "Write";

const initialNodes: Elements | (() => Elements) = [];
const initialEdges: Elements | (() => Elements) = [];
let counter:number = 0;

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};


function createTasksForEdge(edge: Edge, edges:Elements) : void {
    const dep = hasDependency(edge.source, edges);
    const dependencies:Array<string> = [];
    if (dep) {
        dependencies.push(edge.source + Write);
    }
    let task : Task = {
        name: edge.source + Read,
        dependencies: dependencies,
        templateRef: {
            "name": "orca-operators",
            "template": "orca-operators"
        },
        arguments: {
            parameters: [{"name": "OPERATOR", "value": "s3"}, {"name": "OPERATOR_TYPE", "value": "read"},
                {"name": "REDIS_URL", "value": "192.168.2.101"}, {"name": "REDIS_PORT", "value": "6379"}, {"name": "REDIS_PUSH_KEY", "value": "testFinal"}, {"name": "REDIS_POP_KEY", "value": "None"},
                {"name": "AWS_S3_BUCKET_NAME", "value": "databoss-weather-test"}, {"name": "AWS_S3_FILE_PATH", "value": "weather.csv"}, {"name": "AWS_S3_FILE_TYPE", "value": "CSV"},
                {"name": "BOOTSTRAP_SERVERS", "value": "192.168.2.102:9094"}, {"name": "KAFKA_TOPIC", "value": "testFinal"},
                {"name": "ELASTICSEARCH_HOST", "value": "http://192.168.2.101:9200"},  {"name": "ELASTICSEARCH_INDEX", "value": "test"}]
        }
    };
    State.tasks.push(task);
    task = {
        name: edge.target + Write,
        dependencies: [edge.source + Read],
        templateRef: {
            "name": "orca-operators",
            "template": "orca-operators"
        },
        arguments: {
            parameters: [{"name": "OPERATOR", "value": "s3"}, {"name": "OPERATOR_TYPE", "value": "read"},
                {"name": "REDIS_URL", "value": "192.168.2.101"}, {"name": "REDIS_PORT", "value": "6379"}, {"name": "REDIS_PUSH_KEY", "value": "testFinal"}, {"name": "REDIS_POP_KEY", "value": "None"},
                {"name": "AWS_S3_BUCKET_NAME", "value": "databoss-weather-test"}, {"name": "AWS_S3_FILE_PATH", "value": "weather.csv"}, {"name": "AWS_S3_FILE_TYPE", "value": "CSV"},
                {"name": "BOOTSTRAP_SERVERS", "value": "192.168.2.102:9094"}, {"name": "KAFKA_TOPIC", "value": "testFinal"},
                {"name": "ELASTICSEARCH_HOST", "value": "http://192.168.2.101:9200"},  {"name": "ELASTICSEARCH_INDEX", "value": "test"}]
        }
    };
    State.tasks.push(task);
    console.log(State.tasks);
}

function hasDependency(nodeName:string, edges:Elements):boolean {
    const edge = edges.find(x => (x as Edge).target === nodeName);
    return edge !== undefined;
}

const DnDFlow = () => {

    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [nodes, setNodes] = useState<Elements>(initialNodes);
    const [edges, setEdges] = useState<Elements>(initialEdges);


    const onConnect = (params: Edge | Connection) => {
        (params as Edge).animated = true;
        (params as Edge).arrowHeadType = ArrowHeadType.ArrowClosed;
        setEdges((edges) => addEdge(params, edges));
        createTasksForEdge(params as Edge, edges);
    }
    console.log(nodes);
    console.log(edges);
    const onElementsRemove = (elementsToRemove: Elements) => setNodes((nodes) => removeElements(elementsToRemove, nodes));
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
            counter++;
            setNodes((es) => es.concat(newNode));
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

    const nodeS3 = refS3.current as any;
    const nodeKafka = refKafka.current as any;
    const nodeES = refES.current as any;

    const handleClick = (element: any) => {
        if (element.target.nextElementSibling != null){
            const node_type = element.target.nextElementSibling.dataset.nodeid;
            if (node_type === "S3") {
                nodeS3.showS3Form();
                nodeKafka.hideKafkaForm();
                nodeES.hideEsForm();
                console.log(nodeS3.getFormValues());
            } else if (node_type === "Kafka") {
                nodeKafka.showKafkaForm();
                nodeS3.hideS3Form();
                nodeES.hideEsForm();
                console.log(nodeKafka.getFormValues());
            } else if (node_type === "Elasticsearch") {
                nodeES.showESForm();
                nodeKafka.hideKafkaForm();
                nodeS3.hideS3Form();
                console.log(nodeES.getFormValues());
            }
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
                <S3Form ref={refS3}/>
                <KafkaForm ref={refKafka}/>
                <ESForm ref={refES}/>
            </div>
        </div>
    );
};

export default DnDFlow;