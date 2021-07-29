import { DatePicker, Form, Input, TimePicker, Select } from "antd";
import "./forms.scss";
import Password from "antd/es/input/Password";
const FormItem = Form.Item;
const { Option } = Select;

const CreateAntField = (AntComponent) => {
	const Field = ({
		field,
		form,
		hasFeedback,
		label,
		selectOptions,
		submitCount,
		type,
		...props
	}) => {
		const touched = form.touched[field.name];
		const submitted = submitCount > 0;
		const hasError = form.errors[field.name];
		const submittedError = hasError && submitted;
		const touchedError = hasError && touched;
		const onInputChange = ({ target: { value } }) =>
			form.setFieldValue(field.name, value);
		const onChange = (value) => form.setFieldValue(field.name, value);
		const onBlur = () => form.setFieldTouched(field.name, true);

		return (
			<div className={"form-container"}>
				<FormItem
					label={label}
					hasFeedback={
						!!((hasFeedback && submitted) || (hasFeedback && touched))
					}
					help={submittedError || touchedError ? hasError : false}
					validateStatus={submittedError || touchedError ? "error" : "success"}
				>
					<AntComponent
						{...field}
						{...props}
						onBlur={onBlur}
						onChange={type ? onInputChange : onChange}
					>
						{selectOptions &&
							selectOptions.map((name) => (
								<Option key={name} value={""}>
									{name}
								</Option>
							))}
					</AntComponent>
				</FormItem>
			</div>
		);
	};
	return Field;
};

export const AntSelect = CreateAntField(Select);
export const AntDatePicker = CreateAntField(DatePicker);
export const AntInput = CreateAntField(Input);
export const AntTimePicker = CreateAntField(TimePicker);
export const AntPassword = CreateAntField(Password);
