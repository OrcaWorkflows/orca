import { IconButton, useTheme } from "@material-ui/core";
import { User } from "react-feather";

const Account = (): JSX.Element => {
	const theme = useTheme();
	return (
		<IconButton style={{ marginRight: 20 }}>
			<User color={theme.palette.text.primary} />
		</IconButton>
	);
};

export default Account;
