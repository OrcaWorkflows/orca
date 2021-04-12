import React from 'react';
import {Table} from "react-bootstrap";
import Collapsible from "react-collapsible";
import NodeRow from "./rowgenerator";
import './scss/nodes.scss'

const sidebar = () => {
    return (
        <div className="sidebar">
            <Table className={"sidebar-table"}>
                <tbody>
                    <tr>
                       <td>
                           <Collapsible trigger="Amazon Web Service" open={true}>
                               <Table className={"sidebar-table"}>
                                   <tbody>
                                       <NodeRow node={"S3"}/>
                                       <NodeRow node={"DynamoDB"}/>
                                       <NodeRow node={"Kinesis"}/>
                                   </tbody>
                               </Table>
                           </Collapsible>
                       </td>
                    </tr>
                    <tr>
                        <td>
                            <Collapsible trigger="Google Cloud Platform" open={true}>
                                <Table className={"sidebar-table"}>
                                    <tbody>
                                        <NodeRow node={"PubSub"}/>
                                        <NodeRow node={"BigQuery"}/>
                                        <NodeRow node={"DataLab"}/>
                                        <NodeRow node={"DataFlow"}/>
                                    </tbody>
                                </Table>
                            </Collapsible>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Collapsible trigger={"Apache Stack"} open={true}>
                                <Table className={"sidebar-table"}>
                                    <tbody>
                                        <NodeRow node={"Kafka"}/>
                                    </tbody>
                                </Table>
                            </Collapsible>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Collapsible trigger={"ELK Stack"} open={true}>
                                <Table className={"sidebar-table"}>
                                    <tbody>
                                        <NodeRow node={"Elasticsearch"}/>
                                    </tbody>
                                </Table>
                            </Collapsible>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};
export default sidebar;
