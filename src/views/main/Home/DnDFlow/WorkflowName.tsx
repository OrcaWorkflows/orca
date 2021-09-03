import { useEffect, useRef, KeyboardEventHandler } from "react";

import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import { useParams } from "react-router";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError } from "components";
import { IWorkflow } from "interfaces";
import { HomeParams } from "views/main/Home";

const workflowNameValidationSchema = yup.object({
	name: yup.string().nullable(),
});

const WorkflowName = (): JSX.Element => {
	const { workflowID } = useParams<HomeParams>();
	const inputRef = useRef<HTMLElement>();

	const queryClient = useQueryClient();
	const currentWorkflowName = queryClient.getQueryData<IWorkflow>([
		"workflow",
		workflowID,
	])?.name;
	const initialValues = {
		name: currentWorkflowName ?? "",
	};

	const handleKeyDown: KeyboardEventHandler = (event) => {
		if (event.key === "Enter") {
			inputRef.current?.blur();
			handleSubmit(formik.values);
		}
	};

	const { isError, mutateAsync } = useSetWorkflow();
	const handleSubmit = async (values: typeof initialValues) => {
		return mutateAsync({
			name: values.name,
		});
	};

	const formik = useFormik({
		initialValues,
		enableReinitialize: true,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema: workflowNameValidationSchema,
	});

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;
		if (formik.values.name !== initialValues.name)
			timer = setTimeout(() => {
				handleSubmit(formik.values);
			}, 500);
		return () => clearTimeout(timer);
	}, [formik.values.name]);

	return (
		<>
			<TextField
				inputRef={inputRef}
				{...formik.getFieldProps("name")}
				error={
					!!(
						formik.getFieldMeta("name").touched &&
						formik.getFieldMeta("name").error
					)
				}
				onKeyDown={handleKeyDown}
				label="Name of the workflow"
				size="small"
				style={{
					position: "absolute",
					top: 5,
					left: 10,
					zIndex: 5,
				}}
				variant="standard"
			/>
			{isError && <ServerError />}
		</>
	);
};

export default WorkflowName;
