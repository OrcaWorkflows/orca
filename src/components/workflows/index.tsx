import * as React from 'react';
import SideHeader from "../navigation/sideheader";
import './workflows.css'
import {
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Table
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import State from "../data/state";
import {useCallback, useEffect, useState} from "react";
import RequestUtils from "../utils/utils";
import {WorkflowListRes} from "./workflowinterface";


function createData(name:string, calories:number, fat:number, carbs:number, protein:number) {
    console.log(State.workflows);
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export const Workflows = () => {
    const [data, setData] = useState<any[]>([]);


    const fetchData = useCallback(async () => {
        let a = await RequestUtils.getAllWorkflows();
        setData(a.items);
    }, []);

    useEffect(() => {
        fetchData();
    },[fetchData]);

    return (
        <div className={"workflows-root"}>
            <SideHeader/>
            <div className={"workflows-table"}>
                <TableContainer component={Paper}>
                    <Table className={"workflow-table-root"} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((d) => (
                                <TableRow key={d.metadata.name}>
                                    <TableCell component="th" scope="row">
                                        {d.metadata.name}
                                    </TableCell>
                                    <TableCell align="right">{d.metadata.name}</TableCell>
                                    <TableCell align="right">{d.metadata.name}</TableCell>
                                    <TableCell align="right">{d.metadata.name}</TableCell>
                                    <TableCell align="right">{d.metadata.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Workflows;