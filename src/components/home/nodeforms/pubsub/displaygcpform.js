import { Form, Field } from "formik";

import { AntInput } from "../createantfields";
import { isRequired } from "../validatefields";
import "../forms.scss";

const display = ({ handleSubmit, submitCount }) => (
	<Form onSubmit={handleSubmit}>
		<Field
			component={AntInput}
			name="project_id"
			type="project_id"
			placeholder="Project ID"
			submitCount={submitCount}
			validate={isRequired}
			hasFeedback
		/>
		<Field
			component={AntInput}
			name="topic"
			type="topic_name"
			placeholder="Topic"
			submitCount={submitCount}
			validate={isRequired}
			hasFeedback
		/>
		<Field
			component={AntInput}
			name="topic_action"
			type="topic_action"
			placeholder="Topic Action"
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
