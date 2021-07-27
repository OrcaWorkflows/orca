import { forwardRef } from "react";

import { NotificationContainer } from "react-notifications";

const DefaultForm = forwardRef(() => {
	return (
		<div className={"container"}>
			<NotificationContainer />
			<label className={"form-label"}>Have not been implemented yet.</label>
		</div>
	);
});

DefaultForm.displayName = "DefaultForm";

export default DefaultForm;
