import React from 'react';
import { Table } from "react-bootstrap";
import Collapsible from "react-collapsible";

const sidebar = () => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="sidebar">
            <Table className={"sidebar-table"}>
                <tbody>
                    <tr>
                        <Collapsible trigger="Amazon Web Service" >
                            <Table className={"sidebar-table"}>
                                <tr>
                                    <td>
                                        <div className="s3" onDragStart={(event) => onDragStart(event, 'S3')}
                                             draggable/>
                                    </td>
                                    <td>
                                        <span>S3</span>
                                    </td>
                                </tr>
                            </Table>
                        </Collapsible>
                    </tr>
                    <tr>
                        <Collapsible trigger={"Apache Stack"}>
                            <Table className={"sidebar-table"}>
                                <tr>
                                    <td>
                                        <div className="kafka" onDragStart={(event) => onDragStart(event, 'Kafka')} draggable/>
                                    </td>
                                    <td>
                                        <span>Kafka</span>
                                    </td>
                                </tr>
                            </Table>
                        </Collapsible>
                    </tr>
                    <tr>
                        <Collapsible trigger={"ELK Stack"}>
                            <Table className={"sidebar-table"}>
                                <tr>
                                    <td>
                                        <div className="elasticsearch" onDragStart={(event) => onDragStart(event, 'Elasticsearch')}
                                             draggable/>
                                    </td>
                                    <td>
                                        <span>Elasticsearch</span>
                                    </td>
                                </tr>
                            </Table>
                        </Collapsible>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};
export default sidebar;