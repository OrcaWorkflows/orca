import { IconButton, useTheme } from "@material-ui/core";
import { FiUser } from "react-icons/fi";

const Account = (): JSX.Element => {
	const theme = useTheme();
	return (
		<IconButton style={{ marginRight: 20 }}>
			<FiUser color={theme.palette.text.primary} />
		</IconButton>
	);
};

export default Account;
