import { Form, Field } from "formik";

import { AntInput } from "../createantfields";
import { isRequired } from "../validatefields";

const display = ({ handleSubmit, submitCount }) => (
	<Form onSubmit={handleSubmit}>
		<Field
			component={AntInput}
			name="host"
			type="host"
			placeholder="Host"
			submitCount={submitCount}
			validate={isRequired}
			hasFeedback
		/>
		<Field
			component={AntInput}
			name="index_name"
			type="index_name"
			placeholder="Index Name"
			submitCount={submitCount}
			validate={isRequired}
			hasFeedback
		/>
		<div className={"margin-top"}>
			<button className="form-button" type="submit">
				Save
			</button>
		</div>
	</Form>
);
export default display;
