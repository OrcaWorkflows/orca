import Alert from "components/Alert";

const ServerError = (): JSX.Element => {
	return (
		<Alert
			autoHideDuration={3000}
			message="We've met an *unexpected server error* processing your action!"
			severity="error"
		/>
	);
};

export default ServerError;
