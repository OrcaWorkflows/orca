import { makeStyles, useTheme } from "@material-ui/core";
import clsx from "clsx";
import {
	EdgeProps,
	getBezierPath,
	getMarkerEnd,
	EdgeTypesType,
} from "react-flow-renderer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { IWorkflow } from "interfaces";
import { HomeParams } from "views/main/Home";

const useStyles = makeStyles((theme) => ({
	pathSelector: {
		fill: "none",
		stroke: "transparent",
		strokeWidth: 28,
		"&:hover": {
			cursor: "pointer",
		},
	},
	path: {
		fill: "none",
		stroke: theme.palette.primary.light,

		"&:hover": {
			cursor: "pointer",
		},
	},
	"@keyframes runningFrames": {
		to: {
			strokeDashoffset: 0,
		},
	},
	"@keyframes succeededFrames": {
		from: {
			strokeDashoffset: 10,
		},
	},
	pending: {
		stroke: theme.palette.primary.main,
		strokeWidth: 2,
	},
	running: {
		stroke: theme.palette.info.main,
		strokeWidth: 2,
		animation: `$runningFrames 2s linear infinite`,
	},
	succeeded: {
		stroke: theme.palette.success.main,
		strokeWidth: 2,
		strokeDasharray: "10 4",
	},
	failed: {
		stroke: theme.palette.error.main,
		strokeWidth: 2,
	},
	omitted: {
		stroke: theme.palette.primary.light,
		strokeWidth: 2,
		strokeDasharray: "5%",
	},
	selected: {
		stroke: theme.palette.warning.light,
		strokeWidth: 2,
	},
}));

const getEdgeTypes = (): EdgeTypesType => {
	const edgeTypes: EdgeTypesType = {};
	edgeTypes.default = (props: EdgeProps): JSX.Element => {
		const classes = useStyles({ selected: props.selected });
		const theme = useTheme();
		const { workflowID } = useParams<HomeParams>();

		const edgePath = getBezierPath({
			sourceX: props.sourceX,
			sourceY: props.sourceY,
			sourcePosition: props.sourcePosition,
			targetX: props.targetX,
			targetY: props.targetY,
			targetPosition: props.targetPosition,
		});

		const markerEnd = getMarkerEnd(props.arrowHeadType, props.markerEndId);

		const pathLength = Math.hypot(
			Math.abs(props.targetX - props.sourceX),
			Math.abs(props.targetY - props.sourceY)
		);

		const queryClient = useQueryClient();
		const currentWorkflow = queryClient.getQueryData<IWorkflow>([
			"workflow",
			workflowID,
		]);
		const argoWorkflowName = currentWorkflow?.argoWorkflowName ?? "";
		const status = queryClient.getQueryData<any>([
			`workflow/info/status`,
			argoWorkflowName,
		]);

		// "nodes" actually stands for the edges, it's just how endpoint indicates them
		const currentEdgeStatus: any = Object.values(status?.nodes ?? {}).find(
			(node: any) => node.displayName === props.source + "-" + props.target
		);

		return (
			<>
				{currentEdgeStatus?.phase === "Pending" && (
					<circle r="5" fill={theme.palette.primary.light}>
						<animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
					</circle>
				)}
				<filter id="errorShadow" x="0" y="0">
					<feDropShadow
						stdDeviation="8"
						floodColor={theme.palette.error.light}
						floodOpacity="1"
					>
						<animate
							attributeName="stdDeviation"
							values="0;8;0"
							dur="2s"
							repeatCount="indefinite"
						/>
					</feDropShadow>
				</filter>

				<path className={classes.pathSelector} d={edgePath} />
				<path
					id={props.id}
					className={clsx(classes.path, {
						[classes.pending]: currentEdgeStatus?.phase === "Pending",
						[classes.running]: currentEdgeStatus?.phase === "Running",
						[classes.succeeded]: currentEdgeStatus?.phase === "Succeeded",
						[classes.failed]: currentEdgeStatus?.phase === "Failed",
						[classes.omitted]: currentEdgeStatus?.phase === "Omitted",
						[classes.selected]: props.selected,
					})}
					{...(currentEdgeStatus?.phase === "Running"
						? {
								style: {
									strokeDasharray: pathLength,
									strokeDashoffset: pathLength,
								},
						  }
						: {})}
					{...(currentEdgeStatus?.phase === "Failed"
						? {
								filter: "url(#errorShadow)",
						  }
						: {})}
					d={edgePath}
					markerEnd={markerEnd}
				/>
				<title>{currentEdgeStatus?.phase}</title>
			</>
		);
	};
	return edgeTypes;
};

export default getEdgeTypes;
