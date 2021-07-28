import logo from "assets/logo/vector/default-monochrome-black.svg";
import Account from "components/auth/account";
import Logout from "components/auth/logout";

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
