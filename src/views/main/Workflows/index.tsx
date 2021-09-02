import { useEffect } from "react";

import { Container, Grid, IconButton, makeStyles } from "@material-ui/core";
import { ArrowUpCircle } from "react-feather";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "react-query";

import { useInfiniteGetWorkFlows } from "actions/workflowActions";
import { ServerError } from "components";
import { IWorkflow } from "interfaces";
import Loading from "views/main/Workflows/Loading";
import Workflow from "views/main/Workflows/Workflow";

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
	infiniteScroll: { padding: 24 },
	"@keyframes upAndDown": {
		"0%": { transform: "translateY(5px)" },
		"50%": { transform: "translateY(-5px)" },
		"100%": { transform: "translateY(5px)" },
	},
	scrollToTop: {
		marginTop: 10,
		animation: `$upAndDown 1000ms ${theme.transitions.easing.easeInOut} infinite`,
	},
}));

const rowsPerPage = 16;

const Workflows = (): JSX.Element => {
	const classes = useStyles();

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

	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
		});
	};

	return (
		<>
			<Container maxWidth={false}>
				{isLoading ? (
					<Loading rowsPerPage={rowsPerPage} />
				) : (
					<InfiniteScroll
						className={classes.infiniteScroll}
						dataLength={data!.pages.length}
						endMessage={
							window.scrollY > 0 && (
								<Grid
									className={classes.scrollToTop}
									container
									justifyContent="flex-end"
								>
									<IconButton onClick={handleScrollToTop}>
										<ArrowUpCircle size={36} />
									</IconButton>
								</Grid>
							)
						}
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
				)}
			</Container>
			{getWorkflowsError && <ServerError />}
		</>
	);
};

export default Workflows;
