import { useState, MouseEvent, useEffect } from "react";

import {
	Box,
	Collapse,
	Container,
	Grid,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	makeStyles,
	CircularProgress,
} from "@material-ui/core";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "react-feather";

import { useGetOperatorNamesByCategory } from "actions/operatorActions";
import {
	useGetAllOperatorConfigs,
	useGetOperatorConfig,
} from "actions/settingsActions";
import aws from "assets/AWS/aws.png";
import { CollapsibleStack, ServerError } from "components";
import { platforms } from "utils";
import Configuration from "views/main/Settings/OperatorConfigurations/Configuration";

const useStyles = makeStyles((theme) => ({
	root: { height: "calc(100vh - 48px)" },
	bold: { fontWeight: theme.typography.fontWeightBold },
	divider: {
		backgroundColor: theme.palette.primary.light,
	},
	fullHeight: { height: "100%" },
	configurationListItemText: { overflowWrap: "break-word" },
	noconfiguration: {
		fontWeight: theme.typography.fontWeightBold,
		opacity: 0.5,
	},
	list: {
		overflowY: "auto",
	},
	listSubheader: {
		backgroundColor: theme.palette.primary.main,
		fontWeight: theme.typography.fontWeightBold,
		color: theme.palette.text.primary,
		fontSize: theme.typography.h6.fontSize,
	},
}));

const getUniqueBy = (arr: any[], prop: string) => {
	const set = new Set();
	return arr.filter((o) => !set.has(o[prop]) && set.add(o[prop]));
};

const systemWideConfiguredPlatforms = platforms.filter(
	(platform) => platform.text !== "Amazon Web Services"
);

export const OperatorConfigurations = (): JSX.Element => {
	const classes = useStyles();
	const [operatorName, setOperatorName] = useState("AWS");
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

	// Handle AWS
	const [open, setOpen] = useState(true);
	const handleClick = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	const { isError: isErrorAWSOperators, data: AWSOperators } =
		useGetOperatorNamesByCategory({
			categoryName: "AWS",
		});

	useEffect(() => {
		let platformText;
		for (const platform of platforms) {
			for (const option of platform.options) {
				if (option.type === operatorName) platformText = option.text;
			}
		}
		if (platformText) setPlatformText(platformText);

		/* Handle AWS */
		if (operatorName === "AWS") setPlatformText("AWS");

		setConfigID(undefined);
	}, [operatorName]);

	return (
		<>
			<Container maxWidth="md">
				<Grid container className={classes.root}>
					<Grid item xs={3} className={classes.fullHeight}>
						<List dense className={clsx(classes.fullHeight, classes.list)}>
							{/* Handle AWS */}
							<ListItem button onClick={handleClick}>
								<ListItemText
									primaryTypographyProps={{ className: classes.bold }}
									primary="Amazon Web Services"
								/>
								{open ? <ArrowUp /> : <ArrowDown />}
							</ListItem>
							<Collapse in={open} timeout="auto">
								<List disablePadding>
									<ListItem
										button
										onClick={(_event) => onOperatorClick(_event, "AWS")}
										selected={operatorName === "AWS"}
									>
										<ListItemIcon>
											<img src={aws} style={{ height: 24 }} />
										</ListItemIcon>
										<ListItemText primary="AWS" />
									</ListItem>
								</List>
							</Collapse>
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

					<Grid item xs>
						<Configuration
							configID={configID}
							setConfigID={setConfigID}
							operatorName={operatorName}
							platformText={platformText}
						/>
					</Grid>

					<Grid item xs={3} className={classes.fullHeight}>
						{allOperatorConfigs?.filter((config) => {
							/* Handle AWS */
							if (operatorName === "AWS" && AWSOperators) {
								for (const operator of AWSOperators) {
									return config.operatorName === operator.name;
								}
							} else return config.operatorName === operatorName;
						}).length ? (
							<List
								className={clsx(classes.fullHeight, classes.list)}
								subheader={
									<>
										<ListSubheader className={classes.listSubheader}>
											Configurations
										</ListSubheader>
										<Divider className={classes.divider} />
									</>
								}
							>
								{
									/* Handle AWS */
									(operatorName === "AWS" && AWSOperators
										? getUniqueBy(
												allOperatorConfigs.filter((config) => {
													return AWSOperators.find(
														(operator) => config.operatorName === operator.name
													);
												}),
												"name"
										  )
										: allOperatorConfigs.filter(
												(config) => config.operatorName === operatorName
										  )
									).map((config) => (
										<ListItem
											key={config.id}
											button
											divider
											onClick={(_event) => onSettingClick(_event, config.id)}
											selected={config.id === configID}
										>
											<ListItemText
												className={classes.configurationListItemText}
											>
												{config.name}
											</ListItemText>
										</ListItem>
									))
								}
							</List>
						) : (
							<Box
								display="flex"
								height="100%"
								justifyContent="center"
								alignItems="center"
							>
								{isLoadingAllOperatorConfigs && <CircularProgress />}
							</Box>
						)}
					</Grid>
				</Grid>
			</Container>
			{isErrorAWSOperators && (
				<ServerError message="We've met an *unexpected server error* while retrieving the operator configs for AWS!" />
			)}
		</>
	);
};

export default OperatorConfigurations;
