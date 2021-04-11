import React from 'react';
import {Table} from "react-bootstrap";
import Collapsible from "react-collapsible";
import NodeRow from "./rowgenerator";

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
