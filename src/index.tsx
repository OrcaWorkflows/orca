import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { getUnixTime } from "date-fns";
import jwtDecoder from "jwt-decode";
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
import Home from "views/main/home";
import Schedule from "views/main/schedule";
import Settings from "views/main/settings";
import Templates from "views/main/templates";
import Workflows from "views/main/workflows";

import "overlayscrollbars/css/OverlayScrollbars.css";

interface MyToken {
	name: string;
	exp: number;
}
const token = localStorage.getItem("token");
if (token) {
	try {
		const expireTime = jwtDecoder<MyToken>(token).exp;
		if (expireTime < getUnixTime(new Date())) {
			localStorage.removeItem("token");
		}
	} catch (e) {
		localStorage.removeItem("token");
	}
}

const NotFoundRedirect = () => <Redirect to="/" />;
const queryClient = new QueryClient();
ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools initialIsOpen={false} />
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Switch>
					<AuthRoute component={Signin} path="/" exact />
					<AuthRoute component={Signup} path="/signup" exact />
					<MainRoute component={Home} path="/home/:canvasID?" exact />
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
