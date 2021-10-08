import { Dispatch, SetStateAction } from "react";

import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFormik } from "formik";
import { Elements, FlowElement, Node } from "react-flow-renderer";

import { useGetAllOperatorConfigs } from "actions/settingsActions";
import { useSetWorkflow } from "actions/workflowActions";
import { ServerError, TextField } from "components";
import FormManager from "components/FormManager";
import { yup } from "utils";

export const configIDValidationSchema = yup.object({
	config: yup
		.object({
			id: yup.number().integer(),
			name: yup.string(),
		})
		.nullable()
		.required(),
});

const ConfigurationDialog = ({
	configuredNode,
	setConfiguredNode,
	nodes,
	edges,
}: {
	configuredNode: Node;
	setConfiguredNode: Dispatch<SetStateAction<Node | null>>;
	nodes: Elements;
	edges: Elements;
}): JSX.Element | null => {
	const handleClose = () => {
		setConfiguredNode(null);
	};
	const { isError: isSetWorkflowError, mutateAsync: setWorkflowAsync } =
		useSetWorkflow();

	const {
		data: allOperatorConfigs,
		isLoading: isLoadingAllOperatorConfigs,
		isError: isGetAllOperatorConfigsError,
	} = useGetAllOperatorConfigs();

	const initialValues = {
		...configuredNode.data,
	};
	const handleSubmit = async (values: typeof initialValues) => {
		const indexToUpdate = nodes.findIndex(
			(node: FlowElement) => (node as Node).id === (configuredNode as Node).id
		);
		const node = nodes[indexToUpdate];
		const newNode = {
			...node,
			data: { ...nodes[indexToUpdate].data, ...values },
		};
		const newNodes = [...nodes];
		newNodes[indexToUpdate] = newNode;
		return setWorkflowAsync({
			property: { nodes: newNodes, edges },
		}).then(() => {
			handleClose();
		});
	};
	const { Form, validationSchema } = FormManager(configuredNode.type as string);
	const formik = useFormik<typeof initialValues>({
		initialValues,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema: validationSchema.concat(configIDValidationSchema),
	});

	return (
		<>
			{isLoadingAllOperatorConfigs ? (
				<CircularProgress />
			) : (
				<Dialog onClose={handleClose} open={!!configuredNode} maxWidth="xs">
					<DialogTitle>{`${configuredNode.id} Config`}</DialogTitle>
					<form onSubmit={formik.handleSubmit}>
						<DialogContent>
							<Autocomplete
								autoComplete
								fullWidth
								options={
									allOperatorConfigs
										?.filter(
											(config) => config.operatorName === configuredNode.type
										)
										.map((config) => ({
											id: config.id,
											name: config.name,
										})) ?? []
								}
								onBlur={() => {
									formik.setFieldTouched("config");
								}}
								onChange={(_event, value) =>
									formik.setFieldValue("config", value)
								}
								value={formik.values.config}
								getOptionLabel={(option) => option.name}
								renderInput={(params) => (
									<TextField
										{...params}
										fieldMetaProps={{
											...formik.getFieldMeta("config"),
										}}
										fullWidth
										label="Configuration Name"
									/>
								)}
							/>
							<Form formik={formik} />
						</DialogContent>
						<DialogActions>
							<Button
								disabled={formik.isSubmitting || !formik.isValid}
								type="submit"
							>
								Save
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			)}
			{isGetAllOperatorConfigsError && <ServerError />}
			{isSetWorkflowError && <ServerError />}
		</>
	);
};

export default ConfigurationDialog;
