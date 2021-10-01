import { useState, Dispatch, SetStateAction } from "react";

import {
	Button,
	Box,
	Container,
	Grid,
	Divider,
	IconButton,
	makeStyles,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import { Info, Trash2 } from "react-feather";
import { useQueryClient } from "react-query";

import {
	useDeleteOperatorConfig,
	useUpsertOperatorConfig,
} from "actions/settingsActions";
import { AddTooltip, ServerError, TextDialog } from "components";
import { IOperatorConfig } from "interfaces";
import * as serverConfigurationsInitialData from "utils/serverConfigurationsInitialData";
import ConfigurationName, {
	configurationNameValidationSchema,
} from "views/main/Settings/OperatorConfigurations/ConfigurationName";
import {
	AWS,
	AWSValidationSchema,
	Credentials,
	credentialsValidationSchema,
	HostList,
	hostListValidationSchema,
} from "views/main/Settings/OperatorConfigurations/ServerConfigurations";

const useStyles = makeStyles((theme) => ({
	border: {
		borderRight: `1px solid ${theme.palette.primary.dark}`,
	},
	divider: {
		backgroundColor: theme.palette.primary.light,
	},
	flexChild: {
		margin: theme.spacing(1),
	},
	removeConfiguration: {
		display: "block",
		marginLeft: "auto",
	},
}));

const Configuration = ({
	configID,
	setConfigID,
	operatorName,
	platformText,
}: {
	configID: number | undefined;
	setConfigID: Dispatch<SetStateAction<number | undefined>>;
	operatorName: string;
	platformText: string;
}): JSX.Element | null => {
	const classes = useStyles();

	const {
		isError: isErrorUpsertOperatorConfig,
		mutateAsync: upsertOperatorConfig,
	} = useUpsertOperatorConfig({ configID });

	const queryClient = useQueryClient();
	const selectedConfigData: IOperatorConfig | undefined =
		queryClient.getQueryData(["operatorConfig", configID]);

	const isHostListRequired =
		operatorName === "elasticsearch" ||
		operatorName === "kafka" ||
		operatorName === "mongodb" ||
		operatorName === "redis" ||
		operatorName === "mariadb" ||
		operatorName === "mssql" ||
		operatorName === "mysql" ||
		operatorName === "oracle" ||
		operatorName === "postgresql";

	const isCredentialsRequired =
		operatorName === "redis" ||
		operatorName === "mariadb" ||
		operatorName === "mssql" ||
		operatorName === "mysql" ||
		operatorName === "oracle" ||
		operatorName === "postgresql";

	// Handle AWS
	const isAWS = operatorName === "AWS";
	const AWSOperators: { name: string; categoryName: string }[] | undefined =
		queryClient.getQueryData("AWS");

	const initialValues: any = {
		hostList: isHostListRequired
			? selectedConfigData?.hostList ?? [
					{
						host: `:${
							(
								serverConfigurationsInitialData[
									operatorName as keyof typeof serverConfigurationsInitialData
								] as any
							)?.port ?? ""
						}`,
					},
			  ]
			: [],
		username: selectedConfigData?.username ?? "",
		password: selectedConfigData?.password ?? "",
		property: isAWS
			? {
					AWS_REGION_NAME: selectedConfigData?.property.AWS_REGION_NAME ?? "",
					AWS_ACCESS_KEY_ID:
						selectedConfigData?.property.AWS_ACCESS_KEY_ID ?? "",
					AWS_ACCESS_SECRET_KEY:
						selectedConfigData?.property.AWS_ACCESS_SECRET_KEY ?? "",
			  }
			: {},
		name: selectedConfigData?.name ?? "",
		operatorName: selectedConfigData?.operatorName ?? operatorName,
	};

	const handleSubmit = async (values: typeof initialValues) => {
		if (isAWS) {
			if (AWSOperators)
				for (const operator of AWSOperators) {
					upsertOperatorConfig({
						hostList: values.hostList,
						name: values.name,
						operatorName: operator.name,
						password: values.password,
						property: values.property,
						username: values.username,
					}).then((data) => {
						if (data?.id) setConfigID(data.id);
					});
				}
		} else
			upsertOperatorConfig({
				hostList: values.hostList,
				name: values.name,
				operatorName,
				password: values.password,
				property: values.property,
				username: values.username,
			}).then((data) => {
				if (data?.id) setConfigID(data.id);
			});
	};

	let validationSchema = configurationNameValidationSchema;
	if (isAWS) validationSchema = validationSchema.concat(AWSValidationSchema);
	if (isHostListRequired)
		validationSchema = validationSchema.concat(hostListValidationSchema);
	if (isCredentialsRequired)
		validationSchema = validationSchema.concat(credentialsValidationSchema);

	const formik = useFormik<typeof initialValues>({
		initialValues,
		enableReinitialize: true,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema,
	});

	const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
	const { isError: deleteOperatorConfigError, mutate } =
		useDeleteOperatorConfig({ configID } as { configID: number });

	return (
		<>
			<Box
				className={classes.border}
				display="flex"
				flexDirection="column"
				justifyContent="center"
				height="100%"
				p={1}
				position="relative"
			>
				<form onSubmit={formik.handleSubmit}>
					<div className={classes.flexChild}>
						<Container maxWidth="xs">
							<Grid container alignItems="center" spacing={2}>
								<Grid item xs>
									<Grid container justifyContent="space-between">
										<Grid item>
											<Typography
												color="textPrimary"
												display="inline"
												variant="h4"
											>
												{platformText}
											</Typography>
										</Grid>
										<Grid item>
											<Tooltip
												style={{ margin: 3 }}
												title="You can create your own custom configurations here and use them to populate many instances while creating your workflow later on."
											>
												<Info />
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12}>
									<Divider className={classes.divider} />
								</Grid>
								<Grid item xs={12}>
									{configID && (
										<IconButton
											className={classes.removeConfiguration}
											onClick={() => setOpenRemoveDialog(true)}
											disabled={!configID}
										>
											<Trash2 />
										</IconButton>
									)}
								</Grid>
								<Grid item xs={12}>
									<ConfigurationName formik={formik} />
								</Grid>
								{isAWS && (
									<Grid item xs={12}>
										<AWS formik={formik} />
									</Grid>
								)}
								{isCredentialsRequired && (
									<Grid item xs={12}>
										<Credentials formik={formik} />
									</Grid>
								)}
								{isHostListRequired && (
									<Grid item xs={12}>
										<HostList formik={formik} operatorName={operatorName} />
									</Grid>
								)}
								<Grid item>
									<Button
										disabled={formik.isSubmitting || !formik.isValid}
										type="submit"
									>
										Save
									</Button>
								</Grid>
							</Grid>
						</Container>
					</div>
				</form>
				<AddTooltip
					onClick={() => setConfigID(undefined)}
					title="New configuration"
				/>
			</Box>
			<TextDialog
				open={openRemoveDialog}
				onClose={() => setOpenRemoveDialog(false)}
				onConfirm={() => {
					mutate();
					setOpenRemoveDialog(false);
					setConfigID(undefined);
				}}
				title="Remove configuration"
				text="Are you sure to remove the selected configuration ?"
			/>
			{deleteOperatorConfigError && <ServerError />}
			{isErrorUpsertOperatorConfig && <ServerError />}
		</>
	);
};

export default Configuration;
