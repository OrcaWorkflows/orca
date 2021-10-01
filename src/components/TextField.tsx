import { forwardRef, ForwardedRef } from "react";

import {
	TextField as MUITextField,
	Tooltip,
	Typography,
	TextFieldProps,
} from "@material-ui/core";
import { FieldInputProps, FieldMetaProps } from "formik";

const TextField = forwardRef(
	(
		{
			fieldInputProps,
			fieldMetaProps,
			...props
		}: {
			fieldInputProps?: FieldInputProps<unknown>;
			fieldMetaProps?: FieldMetaProps<unknown>;
		} & TextFieldProps,
		ref: ForwardedRef<HTMLElement | undefined>
	): JSX.Element => {
		return (
			<Tooltip
				placement="right"
				open={!!(fieldMetaProps?.touched && fieldMetaProps?.error)}
				title={
					<Typography variant="caption" style={{ whiteSpace: "pre-wrap" }}>
						{fieldMetaProps?.error}
					</Typography>
				}
			>
				<MUITextField
					{...(ref ? { inputRef: ref } : {})}
					{...fieldInputProps}
					error={!!(fieldMetaProps?.touched && fieldMetaProps?.error)}
					{...props}
				/>
			</Tooltip>
		);
	}
);

TextField.displayName = "TextField";

export default TextField;
