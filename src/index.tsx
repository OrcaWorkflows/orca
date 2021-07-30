import { CssBaseline, ThemeProvider } from "@material-ui/core";
import axios from "axios";
import jwtDecoder from "jwt-decode";
import moment from "moment";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";

import { AuthRoute, MainRoute } from "routes";
import theme from "theme";
import Signin from "views/auth/Signin";
import Signup from "views/auth/Signup";
import "./index.css";
import DragNDrop from "views/main/home/dnd/index";
import { createNodes } from "views/main/home/dnd/nodes/nodegenerator";
import Schedule from "views/main/schedule";
import Settings from "views/main/settings";
import Templates from "views/main/templates";
import Workflows from "views/main/workflows";

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

const queryClient = new QueryClient();

const NotFoundRedirect = () => <Redirect to="/" />;

ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools initialIsOpen={false} />{" "}
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Switch>
					<AuthRoute component={Signin} path="/" exact />
					<AuthRoute component={Signup} path="/signup" exact />
					<MainRoute component={DragNDrop} path="/home" protect exact />
					<MainRoute component={Workflows} path="/workflows" protect exact />
					<MainRoute component={Templates} path="/templates" protect exact />
					<MainRoute component={Schedule} path="/schedule" protect exact />
					<MainRoute component={Settings} path="/settings" protect exact />
					<Route component={NotFoundRedirect} />
				</Switch>
			</Router>
		</ThemeProvider>
	</QueryClientProvider>,
	document.getElementById("root")
);
