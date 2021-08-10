import { AppBar, Toolbar, makeStyles } from "@material-ui/core";

import { ReactComponent as OrcaLogo } from "assets/logo/vector/default-monochrome-white.svg";
import Account from "layouts/Main/Header/Account";
import Logout from "layouts/Main/Header/Logout";

const useStyles = makeStyles({ margin: { margin: "auto" } });

const Header = (): JSX.Element => {
	const classes = useStyles();

	return (
		<AppBar>
			<Toolbar variant="dense">
				<OrcaLogo className={classes.margin} title="ORCA" />
				<Account />
				<Logout />
			</Toolbar>
		</AppBar>
	);
};

export default Header;
