import { useState, Dispatch, SetStateAction } from "react";

import {
	Button,
	Box,
	Grid,
	IconButton,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import { Trash2 } from "react-feather";
import { useQueryClient } from "react-query";

import {
	useDeleteOperatorConfig,
	useUpsertOperatorConfig,
} from "actions/settingsActions";
import { ServerError, TextDialog } from "components";
import { IOperatorConfig } from "interfaces";
import * as serverConfigurationsInitialData from "utils/serverConfigurationsInitialData";
import ConfigurationName, {
	configurationNameValidationSchema,
} from "views/main/Settings/OperatorConfigurations/ConfigurationName";
import {
	Credentials,
	credentialsValidationSchema,
	HostList,
	hostListValidationSchema,
} from "views/main/Settings/OperatorConfigurations/ServerConfigurations";

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
	border: { border: `1px solid ${theme.palette.secondary.main}` },
	flexChild: {
		padding: theme.spacing(1),
		margin: theme.spacing(1),
	},
	removeConfiguration: {
		color: theme.palette.error.main,
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
		name: selectedConfigData?.name ?? "",
		operatorName: selectedConfigData?.operatorName ?? operatorName,
	};

	const handleSubmit = async (values: typeof initialValues) => {
		upsertOperatorConfig({
			hostList: values.hostList,
			name: values.name,
			operatorName,
		}).then((data) => {
			if (data?.id) setConfigID(data.id);
		});
	};

	const validationSchema = configurationNameValidationSchema;
	if (isHostListRequired) validationSchema.concat(hostListValidationSchema);
	if (isCredentialsRequired)
		validationSchema.concat(credentialsValidationSchema);

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
				display="flex"
				flexDirection="column"
				justifyContent="center"
				height="100%"
				p={1}
			>
				<IconButton
					className={classes.removeConfiguration}
					onClick={() => setOpenRemoveDialog(true)}
					disabled={!configID}
				>
					<Trash2 />
				</IconButton>
				<div className={classes.flexChild}>
					<Typography
						className={classes.bold}
						display="inline"
						color="textSecondary"
						variant="h4"
					>
						{platformText}
					</Typography>
				</div>
				<form onSubmit={formik.handleSubmit}>
					<div className={classes.flexChild}>
						<Grid container direction="column" alignItems="center" spacing={1}>
							<Grid item xs={12} md={9} lg={6} xl={3}>
								<ConfigurationName formik={formik} />
							</Grid>
							{isCredentialsRequired && (
								<Grid item xs={12} md={9} lg={6} xl={3}>
									<Credentials formik={formik} />
								</Grid>
							)}
							{isHostListRequired && (
								<Grid item xs={12} md={9} lg={6} xl={3}>
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
					</div>
				</form>
				<div className={classes.flexChild}>
					<Typography variant="caption">
						You can create your own custom configurations here and use them to
						populate many instances while creating your workflow later on.
					</Typography>
				</div>
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
