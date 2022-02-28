import Alert from "components/Alert";

const ServerError = ({ message }: { message?: string }): JSX.Element => {
	return (
		<Alert
			autoHideDuration={3000}
			message={
				message ??
				"We've met an *unexpected server error* processing your action!"
			}
			severity="error"
		/>
	);
};

export default ServerError;
