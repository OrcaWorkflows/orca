import { useState } from "react";

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
import { useHistory } from "react-router";

import { usePaginatedGetWorkflows } from "actions/workflowActions";
import { ServerError } from "components";
import { IWorkflow } from "interfaces";
import Loading from "views/main/Monitor/Loading";

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
	container: { height: "calc(100vh - 48px)", padding: 24 },
	link: { cursor: "pointer", textDecoration: "underline" },
	tableContainer: { height: "calc(100% - 52px)" },
	table: { height: "100%" },
	dataRow: { height: 74 },
}));

type Column = {
	id: keyof IWorkflow;
	label: string;
	align?: "left" | "right" | "inherit" | "center" | "justify";
};

const columns: Array<Column> = [
	{ id: "id", label: "ID" },
	{
		id: "name",
		label: "Name",
		align: "right",
	},
	{
		id: "createdAt",
		label: "Created",
		align: "right",
	},
	{
		id: "updatedAt",
		label: "Updated",
		align: "right",
	},
];

export const Monitor = (): JSX.Element | null => {
	const classes = useStyles();
	const history = useHistory();
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
		data,
		isError: getWorkflowsError,
		isLoading,
		isPreviousData,
	} = usePaginatedGetWorkflows({ page, rowsPerPage });

	return (
		<>
			<Container className={classes.container} maxWidth={false}>
				{isLoading ? (
					<Loading rowsPerPage={rowsPerPage} />
				) : (
					<>
						<TableContainer
							className={classes.tableContainer}
							component={Paper}
						>
							<Table stickyHeader>
								<TableHead>
									<TableRow>
										{columns.map((column) => (
											<TableCell key={column.id} align={column.align}>
												<Typography
													className={classes.bold}
													color="textSecondary"
												>
													{column.label}
												</Typography>
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{(
										data as { totalCount: number; workflows: IWorkflow[] }
									).workflows.map((workflow, index) => (
										<TableRow
											className={classes.dataRow}
											hover
											role="checkbox"
											key={workflow.id}
											selected={Boolean(index % 2)}
										>
											{columns.map((column) => {
												const value = workflow[column.id as keyof IWorkflow];
												return (
													<TableCell align={column.align} key={column.id}>
														{column.id === "id" ? (
															<Link
																className={classes.link}
																onClick={() => {
																	history.push(`/home/${value}`);
																}}
															>
																{value}
															</Link>
														) : (
															<Typography
																className={classes.bold}
																variant="body2"
															>
																{column.id === "createdAt" ||
																column.id === "updatedAt"
																	? format(
																			new Date(value as string),
																			"HH:mm dd-MMM-yy"
																	  )
																	: value ?? "-"}
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
							count={data!.totalCount}
							nextIconButtonProps={{
								disabled:
									isPreviousData ||
									data!.totalCount <= rowsPerPage ||
									rowsPerPage * page + data!.workflows.length ===
										data!.totalCount,
							}}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handlePageChange}
							onRowsPerPageChange={handleRowsPerPageChange}
						/>
					</>
				)}
			</Container>
			{getWorkflowsError && <ServerError />}
		</>
	);
};

export default Monitor;
