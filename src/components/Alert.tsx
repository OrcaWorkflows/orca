import { useState } from "react";

import { Snackbar, SnackbarProps } from "@material-ui/core";
import { Alert as MUIAlert, AlertProps } from "@material-ui/lab";

const Alert = ({
	autoHideDuration,
	message,
	severity,
}: { message: string } & AlertProps & SnackbarProps): JSX.Element => {
	const [openAlert, setOpenAlert] = useState(true);
	const handleClose = () => {
		setOpenAlert(false);
	};
	return (
		<Snackbar
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
			open={openAlert}
		>
			<MUIAlert severity={severity} variant="filled">
				{message}
			</MUIAlert>
		</Snackbar>
	);
};

export default Alert;
