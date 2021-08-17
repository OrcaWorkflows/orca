import { useState } from "react";

import { Snackbar, SnackbarProps, Typography } from "@material-ui/core";
import { Alert as MUIAlert, AlertProps } from "@material-ui/lab";

const Alert = ({
	autoHideDuration,
	message,
	severity,
}: { message: string | string[] } & AlertProps &
	SnackbarProps): JSX.Element => {
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
				{Array.isArray(message)
					? message.map((line, index) => (
							<Typography key={index} variant="subtitle2">
								{line}
							</Typography>
					  ))
					: message}
			</MUIAlert>
		</Snackbar>
	);
};

export default Alert;
