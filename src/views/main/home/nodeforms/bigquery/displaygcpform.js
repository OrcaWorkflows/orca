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
			name="dataset_id"
			type="dataset_id"
			placeholder="Dataset ID"
			submitCount={submitCount}
			validate={isRequired}
			hasFeedback
		/>
		<Field
			component={AntInput}
			name="table_id"
			type="table_id"
			placeholder="Table ID"
			submitCount={submitCount}
			validate={isRequired}
			hasFeedback
		/>
		<Field
			component={AntInput}
			name="query"
			type="query"
			placeholder="Query"
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
