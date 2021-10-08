import { MouseEvent } from "react";

import { Fab, makeStyles, Tooltip } from "@material-ui/core";
import { FiPlus } from "react-icons/fi";

const useStyles = makeStyles(() => ({
	addIcon: {
		position: "absolute",
		bottom: 30,
		right: 30,
		zIndex: 5,
	},
}));

const AddTooltip = ({
	onClick,
	className,
	title,
}: {
	onClick: (_event: MouseEvent) => void;
	className?: string;
	title: string;
}): JSX.Element => {
	const classes = useStyles();

	return (
		<Tooltip title={title}>
			<Fab
				className={className ?? classes.addIcon}
				size="small"
				color="secondary"
				onClick={onClick}
			>
				<FiPlus />
			</Fab>
		</Tooltip>
	);
};

export default AddTooltip;
