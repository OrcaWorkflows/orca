import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./auth.scss";

const Account = () => {
	const styleForButton = {
		cursor: "pointer",
		width: "40px",
		height: "40px",
		display: "block",
		"margin-left": "auto",
		"margin-right": "auto",
	};

	return (
		<div className={"profile-container"}>
			<AccountCircleIcon style={styleForButton}>Logout</AccountCircleIcon>
			<div className={"username"}>
				<label>{localStorage.getItem("username")}</label>
			</div>
		</div>
	);
};

export default Account;
