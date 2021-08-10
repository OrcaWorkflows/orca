import { IconButton } from "@material-ui/core";
import { User } from "react-feather";

const Account = (): JSX.Element => {
	return (
		<IconButton style={{ marginRight: 20 }} color="inherit">
			<User />
		</IconButton>
	);
};

export default Account;
