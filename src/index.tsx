import axios from "axios";
import jwtDecoder from "jwt-decode";
import moment from "moment";
import ReactDOM from "react-dom";
import {
	BrowserRouter,
	BrowserRouter as Router,
	Switch,
	Route,
	withRouter,
} from "react-router-dom";

import logo from "./assets/logo/vector/default-monochrome-black.svg";
import Account from "./components/auth/account";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import "./index.css";
import DragNDrop from "./components/home/dnd/index";
import { createNodes } from "./components/home/dnd/nodes/nodegenerator";
import Schedule from "./components/schedule";
import Settings from "./components/settings";
import Templates from "./components/templates";
import Workflows from "./components/workflows";

axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = "Bearer " + token;
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

axios.interceptors.response.use((response) => {
	const token = response.headers.authorization;
	if (token && token !== localStorage.getItem("token")) {
		localStorage.setItem("token", token);
	}
	return response;
});

const token = localStorage.getItem("token");

interface MyToken {
	name: string;
	exp: number;
}

if (token) {
	try {
		const expireTime = jwtDecoder<MyToken>(token).exp;
		if (moment.unix(expireTime) < moment()) {
			localStorage.removeItem("token");
		}
	} catch (e) {
		localStorage.removeItem("token");
	}
}

// Create Custom Nodes
createNodes();

export const SEPARATOR = "-";

export const getHidden = () => {
	const isLoggedIn = localStorage.getItem("token");
	return isLoggedIn != null;
};

const Header = withRouter(() => {
	return (
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
});

const OrcaRouter = () => {
	if (!localStorage.getItem("token")) {
		console.log("Token is not set!");
		return <Login />;
	}
	console.log("Token is set!");
	return (
		<div className="wrapper">
			<BrowserRouter>
				<Switch>
					<Route path="/home">
						<DragNDrop />
					</Route>
					<Route path="/workflows">
						<Workflows />
					</Route>
					<Route path="/templates">
						<Templates />
					</Route>
					<Route path="/schedule">
						<Schedule />
					</Route>
					<Route path="/settings">
						<Settings />
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

ReactDOM.render(
	<Router forceRefresh={true}>
		{getHidden() ? <Header /> : ""}
		<OrcaRouter />
	</Router>,
	document.getElementById("root")
);
