import { useEffect } from "react";

import { Container, Grid, makeStyles } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router";

import { useInfiniteGetWorkFlows } from "actions/workflowActions";
import { AddTooltip, ServerError } from "components";
import { IWorkflow } from "interfaces";
import Loading from "views/main/Workflows/Loading";
import Workflow from "views/main/Workflows/Workflow";

const useStyles = makeStyles((theme) => ({
	addIcon: {
		position: "fixed",
		bottom: 30, // top: 48 + 30 pixels from top
		right: 30,
		zIndex: 5,
	},
	bold: { fontWeight: theme.typography.fontWeightBold },
	infiniteScroll: { padding: 24 },
	"@keyframes upAndDown": {
		"0%": { transform: "translateY(5px)" },
		"50%": { transform: "translateY(-5px)" },
		"100%": { transform: "translateY(5px)" },
	},
	scrollToTop: {
		zIndex: 5,
		animation: `$upAndDown 1000ms ${theme.transitions.easing.easeInOut} infinite`,
	},
}));

const rowsPerPage = 20;

const Workflows = (): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isError: getWorkflowsError,
		isLoading,
	} = useInfiniteGetWorkFlows({ rowsPerPage });

	const queryClient = useQueryClient();
	useEffect(() => {
		return () => {
			queryClient.resetQueries("workflows", { exact: true });
		};
	}, []);

	return (
		<>
			<Container maxWidth={false}>
				{isLoading ? (
					<Loading rowsPerPage={rowsPerPage} />
				) : (
					<>
						<InfiniteScroll
							className={classes.infiniteScroll}
							dataLength={data!.pages.length}
							hasMore={!!hasNextPage}
							loader={<Loading rowsPerPage={rowsPerPage / 2} />}
							next={fetchNextPage}
							scrollThreshold={0.75}
						>
							<Grid container justifyContent="center" spacing={3}>
								{data!.pages.map((group) =>
									group.workflows.map((workflow: IWorkflow) => (
										<Grid item xs="auto" key={workflow.id}>
											<Workflow workflow={workflow} />
										</Grid>
									))
								)}
							</Grid>
						</InfiniteScroll>
					</>
				)}
			</Container>
			<AddTooltip
				className={classes.addIcon}
				onClick={() => {
					history.push({ pathname: "/home", state: { addNew: true } });
				}}
				title="New workflow"
			/>
			{getWorkflowsError && <ServerError />}
		</>
	);
};

export default Workflows;
