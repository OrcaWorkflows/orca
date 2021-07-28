import { CssBaseline, ThemeProvider } from "@material-ui/core";
import axios from "axios";
import jwtDecoder from "jwt-decode";
import moment from "moment";
import ReactDOM from "react-dom";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";

import Login from "components/auth/Login";
import Signup from "components/auth/Signup";
import { AuthRoute, MainRoute } from "routes";
import theme from "theme";

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

const NotFoundRedirect = () => <Redirect to="/" />;

ReactDOM.render(
	<Router>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Switch>
				<AuthRoute component={Login} path="/" exact />
				<AuthRoute component={Signup} path="/signup" exact />
				<MainRoute component={DragNDrop} path="/home" protect exact />
				<MainRoute component={Workflows} path="/workflows" protect exact />
				<MainRoute component={Templates} path="/templates" protect exact />
				<MainRoute component={Schedule} path="/schedule" protect exact />
				<MainRoute component={Settings} path="/settings" protect exact />
				<Route component={NotFoundRedirect} />
			</Switch>
		</ThemeProvider>
	</Router>,
	document.getElementById("root")
);
