import { Form } from "formik";

const display = ({ handleSubmit, submitCount }) => (
	<Form onSubmit={handleSubmit}>
		<div className={"content-conf"}>
			<div className={"margin-top"}></div>
		</div>
	</Form>
);
export default display;
