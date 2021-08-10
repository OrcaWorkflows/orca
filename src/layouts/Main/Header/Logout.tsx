import { IconButton } from "@material-ui/core";
import { LogOut } from "react-feather";
import { useHistory } from "react-router-dom";

const Logout = (): JSX.Element => {
	const history = useHistory();

	const logout = () => {
		localStorage.clear();
		history.push("/");
	};

	return (
		<IconButton onClick={logout}>
			<LogOut />
		</IconButton>
	);
};

export default Logout;
