import { useState, MouseEvent } from "react";

import {
	Container,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	makeStyles,
	Typography,
	TablePaginationProps,
} from "@material-ui/core";
import { format } from "date-fns";

import {
	useGetCanvasByWorkflowID,
	useGetWorkflows,
} from "actions/workflowActions";
import { ServerError } from "components";
import Loading from "views/main/workflows/Loading";

const useStyles = makeStyles(() => ({
	container: { height: "calc(100vh - 48px)", padding: 24 },
	tableContainer: { height: "calc(100% - 52px)" },
	table: { height: "100%" },
	head: { fontWeight: "bold" },
}));

interface Column {
	id: string;
	label: string;
	align?: "left" | "right" | "inherit" | "center" | "justify";
}

const columns: Array<Column> = [
	{ id: "name", label: "Name" },
	{
		id: "phase",
		label: "Phase",
		align: "right",
	},
	{
		id: "startedAt",
		label: "Started",
		align: "right",
	},
	{
		id: "finishedAt",
		label: "Finished",
		align: "right",
	},
	{
		id: "progress",
		label: "Progress",
		align: "right",
	},
];

export const Workflows = (): JSX.Element | null => {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handlePageChange: TablePaginationProps["onPageChange"] = (
		_event,
		newPage
	) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange: TablePaginationProps["onRowsPerPageChange"] = (
		event
	) => {
		setRowsPerPage(Number(event.target.value));
		setPage(0);
	};

	const {
		isError: getWorkflowsError,
		isFetching,
		isLoading,
		items,
	} = useGetWorkflows();

	const {
		isError: getCanvasByWorkflowIDError,
		mutateAsync: getCanvasByWorkflowID,
	} = useGetCanvasByWorkflowID();
	const handleWorkflowOnClick = (_event: MouseEvent, workflowName: string) => {
		getCanvasByWorkflowID({ workflowName }).then((data) => {
			console.log("Canvas by workflow id: ", data);
		});
	};

	return (
		<>
			<Container className={classes.container} maxWidth={false}>
				{isLoading || isFetching ? (
					<Loading rowsPerPage={rowsPerPage} />
				) : (
					<>
						<TableContainer
							className={classes.tableContainer}
							component={Paper}
						>
							<Table className={classes.table} stickyHeader>
								<TableHead>
									<TableRow>
										{columns.map((column) => (
											<TableCell key={column.id} align={column.align}>
												<Typography className={classes.head}>
													{column.label}
												</Typography>
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{items
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((item, index) => (
											<TableRow
												hover
												role="checkbox"
												key={item.metadata.name}
												selected={Boolean(index % 2)}
											>
												{columns.map((column) => {
													const value =
														item.status.nodes[item.metadata.name][column.id];
													return (
														<TableCell align={column.align} key={column.id}>
															{column.id === "name" ? (
																<Link
																	onClick={(_event) =>
																		handleWorkflowOnClick(_event, value)
																	}
																>
																	{value}
																</Link>
															) : (
																<Typography
																	color={
																		value === "Failed" ? "error" : "secondary"
																	}
																	variant="body2"
																>
																	{column.id === "startedAt" ||
																	column.id === "finishedAt"
																		? format(new Date(value), "HH:mm dd-MMM-yy")
																		: value}
																</Typography>
															)}
														</TableCell>
													);
												})}
											</TableRow>
										))}
								</TableBody>
							</Table>
						</TableContainer>

						<TablePagination
							rowsPerPageOptions={[10, 25]}
							component="div"
							count={items.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handlePageChange}
							onRowsPerPageChange={handleRowsPerPageChange}
						/>
					</>
				)}
			</Container>
			{getWorkflowsError && <ServerError />}
			{getCanvasByWorkflowIDError && <ServerError />}
		</>
	);
};

export default Workflows;
