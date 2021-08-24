import { Fragment, useState } from "react";

import { Snackbar, SnackbarProps, Typography } from "@material-ui/core";
import { Alert as MUIAlert, AlertProps } from "@material-ui/lab";

const Alert = ({
	autoHideDuration,
	message,
	severity,
}: {
	message:
		| string
		| {
				[k: string]: string[];
		  };
} & AlertProps &
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
				{typeof message === "object"
					? Object.keys(message).map((key) => {
							const lines = message[key];
							return (
								<Fragment key={key}>
									<Typography>{key}</Typography>
									{lines.map((line) => (
										<Typography key={line} variant="subtitle2">
											{line}
										</Typography>
									))}
								</Fragment>
							);
					  })
					: message}
			</MUIAlert>
		</Snackbar>
	);
};

export default Alert;
