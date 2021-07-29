import logo from "assets/logo/vector/default-monochrome-black.svg";
import Account from "views/auth/account";
import Logout from "views/auth/logout";

const Header = () => (
	<div className={"main-header"}>
		<header>
			<div className={"logo-item"}>
				<img src={logo} alt={"Logo"} />
			</div>
			<Account />
			<Logout />
		</header>
	</div>
);

export default Header;
