import { IconButton, useTheme } from "@material-ui/core";
import { LogOut } from "react-feather";
import { useHistory } from "react-router-dom";

const Logout = (): JSX.Element => {
	const history = useHistory();
	const theme = useTheme();

	const logout = () => {
		localStorage.removeItem("token");
		history.push("/");
	};

	return (
		<IconButton onClick={logout}>
			<LogOut color={theme.palette.text.primary} />
		</IconButton>
	);
};

export default Logout;
