import { IconButton, useTheme } from "@material-ui/core";
import { FiLogOut } from "react-icons/fi";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

const Logout = (): JSX.Element => {
	const history = useHistory();
	const theme = useTheme();

	const queryClient = useQueryClient();
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		queryClient.clear();
		history.push("/");
	};

	return (
		<IconButton onClick={logout}>
			<FiLogOut color={theme.palette.text.primary} />
		</IconButton>
	);
};

export default Logout;
