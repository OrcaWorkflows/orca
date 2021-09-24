import { useState, MouseEvent, useEffect } from "react";

import {
	Grid,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Typography,
	makeStyles,
	CircularProgress,
	useTheme,
} from "@material-ui/core";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import {
	useGetAllOperatorConfigs,
	useGetOperatorConfig,
} from "actions/settingsActions";
import { CollapsibleStack } from "components";
import { platforms } from "utils";
import Configuration from "views/main/Settings/OperatorConfigurations/Configuration";

const useStyles = makeStyles((theme) => ({
	listSubheader: {
		backgroundColor: theme.palette.background.default,
		fontWeight: theme.typography.fontWeightBold,
	},
	noconfiguration: {
		fontWeight: theme.typography.fontWeightBold,
		opacity: 0.5,
		padding: 5,
	},
	content: {
		border: `1px solid ${theme.palette.secondary.main}`,
		borderRadius: theme.shape.borderRadius,
		margin: theme.spacing(6),
	},
	fullHeight: { height: "100%" },
	root: { height: "calc(100vh - 48px)" },
}));

const systemWideConfiguredPlatforms = platforms.filter(
	(platform) => platform.text !== "Amazon Web Services"
);

export const OperatorConfigurations = (): JSX.Element => {
	const classes = useStyles();
	const theme = useTheme();
	const [operatorName, setOperatorName] = useState("postgresql");
	const [configID, setConfigID] = useState<number>();
	const [platformText, setPlatformText] = useState("");

	const { data: allOperatorConfigs, isLoading: isLoadingAllOperatorConfigs } =
		useGetAllOperatorConfigs();

	const onOperatorClick = (_event: MouseEvent, data: string) => {
		setOperatorName(data);
	};
	const onSettingClick = (_event: MouseEvent, configID: number) => {
		setConfigID(configID);
	};
	useGetOperatorConfig({ configID });

	useEffect(() => {
		let platformText;
		for (const platform of platforms) {
			for (const option of platform.options) {
				if (option.type === operatorName) platformText = option.text;
			}
		}
		if (platformText) setPlatformText(platformText);
	}, [operatorName]);

	return (
		<Grid container className={classes.root}>
			<OverlayScrollbarsComponent
				options={{
					scrollbars: { autoHide: "leave" },
				}}
			>
				<Grid item xs="auto" className={classes.fullHeight}>
					<List dense>
						{systemWideConfiguredPlatforms.map((stackData) => (
							<CollapsibleStack
								iconSize={24}
								data={stackData}
								key={stackData.text}
								onClick={onOperatorClick}
								selectedOptionType={operatorName}
							/>
						))}
					</List>
				</Grid>
			</OverlayScrollbarsComponent>
			<Grid item xs className={classes.content}>
				<Configuration
					configID={configID}
					setConfigID={setConfigID}
					operatorName={operatorName}
					platformText={platformText}
				/>
			</Grid>
			{allOperatorConfigs?.filter(
				(config) => config.operatorName === operatorName
			).length ? (
				<OverlayScrollbarsComponent
					options={{
						scrollbars: { autoHide: "leave" },
					}}
				>
					<Grid item xs="auto" className={classes.fullHeight}>
						<List
							subheader={
								<ListSubheader className={classes.listSubheader}>
									Configurations
								</ListSubheader>
							}
						>
							{allOperatorConfigs
								.filter((config) => config.operatorName === operatorName)
								.sort((config) => -Number(config.createdAt))
								.map((config) => (
									<ListItem
										key={config.id}
										button
										divider
										onClick={(_event) => onSettingClick(_event, config.id)}
										selected={config.id === configID}
									>
										<ListItemText>{config.name}</ListItemText>
									</ListItem>
								))}
						</List>
					</Grid>
				</OverlayScrollbarsComponent>
			) : (
				<Grid item xs={2} className={classes.fullHeight}>
					<Grid
						className={classes.fullHeight}
						container
						justifyContent="center"
						alignItems="center"
					>
						<Grid item xs="auto">
							{isLoadingAllOperatorConfigs ? (
								<CircularProgress
									style={{ color: theme.palette.secondary.main }}
								/>
							) : (
								<Typography className={classes.noconfiguration} align="center">
									No configuration created yet for the selected platform.
								</Typography>
							)}
						</Grid>
					</Grid>
				</Grid>
			)}
		</Grid>
	);
};

export default OperatorConfigurations;
