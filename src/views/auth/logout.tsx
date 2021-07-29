import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";

const Logout = () => {
	const history = useHistory();
	const logout = () => {
		localStorage.clear();
		history.push("/");
	};

	const styleForButton = {
		cursor: "pointer",
		width: "40px",
		height: "40px",
	};

	return (
		<div className={"logout-container"}>
			<ExitToAppIcon style={styleForButton} onClick={logout}>
				Logout
			</ExitToAppIcon>
		</div>
	);
};

export default Logout;