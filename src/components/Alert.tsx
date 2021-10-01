import { Fragment, useState, SyntheticEvent } from "react";

import {
	Snackbar,
	SnackbarProps,
	Typography,
	SnackbarCloseReason,
} from "@material-ui/core";
import { Alert as MUIAlert, AlertProps } from "@material-ui/lab";

const Alert = ({
	message,
	...props
}: {
	message:
		| string
		| {
				[k: string]: string[];
		  };
} & AlertProps &
	SnackbarProps): JSX.Element => {
	const [openAlert, setOpenAlert] = useState(true);
	const handleClose = (
		_event: SyntheticEvent<any, Event>,
		reason: SnackbarCloseReason
	) => {
		setOpenAlert(false);
		if (props.onClose) props.onClose(_event, reason);
	};
	return (
		<Snackbar
			anchorOrigin={props.anchorOrigin}
			autoHideDuration={props.autoHideDuration}
			onClose={handleClose}
			open={openAlert}
		>
			<MUIAlert severity={props.severity} variant="filled">
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
