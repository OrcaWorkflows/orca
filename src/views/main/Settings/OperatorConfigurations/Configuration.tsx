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
import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import { FiInfo, FiTrash2 } from "react-icons/fi";
import { useQueryClient } from "react-query";

import {
	useDeleteOperatorConfig,
	useUpsertOperatorConfig,
} from "actions/settingsActions";
import { AddTooltip, Alert, ServerError, TextDialog } from "components";
import { IOperatorConfig } from "interfaces";
import { yup } from "utils";
import * as serverConfigurationsInitialData from "utils/serverConfigurationsInitialData";
import ConfigurationName from "views/main/Settings/OperatorConfigurations/ConfigurationName";
import {
	AWS,
	AWSValidationSchema,
	Credentials,
	credentialsValidationSchema,
	HostList,
	hostListValidationSchema,
	Snowflake,
	SnowflakeValidationSchema,
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

const filterPropertiesByPlatform = (property:any, platform:string) :any => {  // Must include the name of platform inside the attribute
	const filteredProperties :Record<string,any> = {}
	for (const key of Object.keys(property)) {
		if(key.toLowerCase().includes(platform.toLowerCase()))
			filteredProperties[key] = property[key]
	}
	return filteredProperties
}

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
		isSuccess: isSuccessUpsertOperatorConfig,
		mutateAsync: upsertOperatorConfig,
	} = useUpsertOperatorConfig();

	const queryClient = useQueryClient();
	const allOperatorConfigs = queryClient.getQueryData([
		"allOperatorConfigs",
	]) as IOperatorConfig[];
	const selectedConfigData: IOperatorConfig | undefined =
		queryClient.getQueryData(["operatorConfig", configID]);

	const includesHostList =
		operatorName === "elasticsearch" ||
		operatorName === "kafka" ||
		operatorName === "mongodb" ||
		operatorName === "redis" ||
		operatorName === "mariadb" ||
		operatorName === "mssql" ||
		operatorName === "mysql" ||
		operatorName === "oracle" ||
		operatorName === "postgresql";

	const includesCredentials =
		operatorName === "redis" ||
		operatorName === "mariadb" ||
		operatorName === "mssql" ||
		operatorName === "mysql" ||
		operatorName === "oracle" ||
		operatorName === "postgresql" ||
		operatorName === "snowflake";

	// Handle AWS
	const isAWS = operatorName === "AWS";
	const isSnowflake = operatorName === "snowflake";

	const AWSOperators: { name: string; categoryName: string }[] | undefined =
		queryClient.getQueryData("AWS");

	// Keep all types of props in initialData to have "controlled inputs" in all cases
	const initialValues: any = {
		hostList: includesHostList
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
		name: selectedConfigData?.name ?? "",
		operatorName: selectedConfigData?.operatorName ?? operatorName,
		username: selectedConfigData?.username ?? "",
		password: selectedConfigData?.password ?? "",
		property: {
			AWS_REGION_NAME: selectedConfigData?.property?.AWS_REGION_NAME ?? "",
			AWS_ACCESS_KEY_ID: selectedConfigData?.property?.AWS_ACCESS_KEY_ID ?? "",
			AWS_ACCESS_SECRET_KEY:
				selectedConfigData?.property?.AWS_ACCESS_SECRET_KEY ?? "",
			SNOWFLAKE_WAREHOUSE: selectedConfigData?.property?.SNOWFLAKE_WAREHOUSE ?? "",
			SNOWFLAKE_ACCOUNT_IDENTIFIER: selectedConfigData?.property?.SNOWFLAKE_ACCOUNT_IDENTIFIER ?? "",
		},
	};

	const handleSubmit = async (values: typeof initialValues) => {
		if (isAWS) {
			if (AWSOperators) {
				if (selectedConfigData) {
					const AWSOperatorConfigsToUpdate = allOperatorConfigs?.filter(
						(config) => config.name === selectedConfigData?.name
					);
					for (const operator of AWSOperatorConfigsToUpdate) {
						upsertOperatorConfig({
							id: operator.id,
							hostList: values.hostList,
							name: values.name,
							operatorName: operator.name,
							property: filterPropertiesByPlatform(values.property, "AWS")
						}).then((data) => {
							if (data?.id) setConfigID(data.id);
						});
					}
				} else
					for (const operator of AWSOperators) {
						upsertOperatorConfig({
							hostList: values.hostList,
							name: values.name,
							operatorName: operator.name,
							property: filterPropertiesByPlatform(values.property, "AWS")
						}).then((data) => {
							if (data?.id) setConfigID(data.id);
						});
					}
			}
		} else if(isSnowflake) {
			upsertOperatorConfig({
				id: configID,
				hostList: values.hostList,
				name: values.name,
				operatorName,
				password: values.password,
				username: values.username,
				property: filterPropertiesByPlatform(values.property, "Snowflake")
			}).then((data) => {
				if (data?.id) setConfigID(data.id);
			});
		} else {
			if (includesCredentials) {
				upsertOperatorConfig({
					id: configID,
					hostList: values.hostList,
					name: values.name,
					operatorName,
					password: values.password,
					username: values.username,
					property: values.property,
				}).then((data) => {
					if (data?.id) setConfigID(data.id);
				});
			} else {
				upsertOperatorConfig({
					id: configID,
					hostList: values.hostList,
					name: values.name,
					property: values.property,
					operatorName,
				}).then((data) => {
					if (data?.id) setConfigID(data.id);
				});
			}
		}
	};

	const handleDeleteConfirm = () => {
		if (isAWS) {
			if (AWSOperators) {
				const AWSOperatorConfigsToDelete = allOperatorConfigs?.filter(
					(config) => config.name === selectedConfigData?.name
				);
				for (const operator of AWSOperatorConfigsToDelete) {
					deleteOperatorConfig({
						id: operator.id,
					});
				}
			}
		} else deleteOperatorConfig({ id: configID as number });
	};

	// Defined here because of async dependencies
	const configurationNameValidationSchema = yup.object({
		name: yup
			.string()
			.required()
			.test(
				"nameNotUnique",
				"Configuration Name is not unique",
				function (value) {
					let occurences = 0;
					if (allOperatorConfigs) {
						for (const config of allOperatorConfigs) {
							if (config.name === value) occurences++;
						}
					}
					if (selectedConfigData) {
						if (isAWS) return occurences > 5 ? false : true;
						else return occurences > 1 ? false : true;
					} else {
						if (isAWS) return occurences === 5 ? false : true;
						else return occurences === 1 ? false : true;
					}
				}
			),
	});

	const formik = useFormik<typeof initialValues>({
		initialValues,
		enableReinitialize: true,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validate: (values: typeof initialValues) => {
			let validationSchema = configurationNameValidationSchema;
			if (isAWS)
				validationSchema = validationSchema.concat(AWSValidationSchema);
			if (isSnowflake)
				validationSchema = validationSchema.concat(SnowflakeValidationSchema);
			if (includesHostList)
				validationSchema = validationSchema.concat(hostListValidationSchema);
			if (includesCredentials) {
				validationSchema = validationSchema.concat(credentialsValidationSchema);
			}
			try {
				validateYupSchema<typeof initialValues>(
					values,
					validationSchema,
					true,
					{
						operatorName,
					}
				);
			} catch (err) {
				return yupToFormErrors(err);
			}
			return {};
		},
	});

	const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
	const { isError: deleteOperatorConfigError, mutate: deleteOperatorConfig } =
		useDeleteOperatorConfig();

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
												<div>
													<FiInfo />
												</div>
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
											<FiTrash2 />
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
								{isSnowflake && (
									<Grid item xs={12}>
										<Snowflake formik={formik} />
									</Grid>
								)}
								{includesCredentials && (
									<Grid item xs={12}>
										<Credentials formik={formik} operatorName={operatorName} />
									</Grid>
								)}
								{includesHostList && (
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
					handleDeleteConfirm();
					setOpenRemoveDialog(false);
					setConfigID(undefined);
				}}
				title="Remove configuration"
				text="Are you sure to remove the selected configuration ?"
			/>
			{deleteOperatorConfigError && <ServerError />}
			{isErrorUpsertOperatorConfig && <ServerError />}
			{isSuccessUpsertOperatorConfig && (
				<Alert
					autoHideDuration={3000}
					message="Submitted successfuly!"
					severity="success"
				/>
			)}
		</>
	);
};

export default Configuration;
