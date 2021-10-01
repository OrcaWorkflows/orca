import { useEffect, useRef, KeyboardEventHandler } from "react";

import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import { useParams } from "react-router";
import * as yup from "yup";

import { useSetWorkflow } from "actions/workflowActions";
import { ServerError, TextField } from "components";
import { IWorkflow } from "interfaces";
import { HomeParams } from "views/main/Home";

const workflowNameValidationSchema = yup.object({
	name: yup.string().required("Workflow Name is a required field"),
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

	const { isError, mutateAsync: setWorkflow } = useSetWorkflow();
	const handleSubmit = async (values: typeof initialValues) => {
		return setWorkflow({
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
				ref={inputRef}
				fieldInputProps={{ ...formik.getFieldProps("name") }}
				fieldMetaProps={{ ...formik.getFieldMeta("name") }}
				onKeyDown={handleKeyDown}
				label="Workflow Name"
				required
				size="small"
				style={{
					position: "absolute",
					top: 5,
					left: 10,
					zIndex: 5,
				}}
			/>
			{isError && <ServerError />}
		</>
	);
};

export default WorkflowName;
