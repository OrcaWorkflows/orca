import {
	Button,
	Dialog,
	DialogProps,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

const TextDialog = ({
	open,
	onClose,
	onConfirm,
	title,
	text,
}: DialogProps & {
	onConfirm: () => unknown;
	title: string;
	text: string;
}): JSX.Element => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText color="textPrimary" variant="body2">
					{text}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onConfirm}>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TextDialog;
