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
    Table,
    TablePagination
} from "@material-ui/core";
import { useEffect, useState} from "react";
import {getAllWorkflows} from "../../actions/workflow_actions";


interface Column {
    id:string,
    label:string,
    minWidth:number,
    align?:"left"|"right"|"inherit"|"center"|"justify",
}

const columns:Array<Column> = [
    { id: 'name', label: 'Name', minWidth: 170},
    {
        id: 'phase',
        label: 'Phase',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'startedAt',
        label: 'Started',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'finishedAt',
        label: 'Finished',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'progress',
        label: 'Progress',
        minWidth: 170,
        align: 'right',
    },
];

export const Workflows = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event:any, newPage:number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        getAllWorkflows().then(r => {
            setData(r.items);
        });
    },[]);

    return (
        <div className={"workflows-root"}>
            <SideHeader/>
            <div className={"workflows-table"}>
                <TableContainer component={Paper}>
                    <Table className={"workflow-table-root"} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                        {columns.map((column) => {
                                            const value = column.id;
                                            return (
                                                <TableCell align={column.align}>
                                                    {row.status.nodes[row.metadata.name][value]}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10,25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
}

export default Workflows;