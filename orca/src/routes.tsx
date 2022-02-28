import { FunctionComponent } from "react";

import { Redirect, Route, RouteProps } from "react-router-dom";

import Auth from "layouts/Auth";
import Main from "layouts/Main";
import Signin from "views/auth/Signin";

const ProtectedRoute = ({
	component: Component,
	layout: Layout,
	...rest
}: { layout: FunctionComponent } & RouteProps): JSX.Element | null => {
	if (!Component) return null; // Because component is defined as optional in RouteProps
	return (
		<Route
			{...rest}
			render={(props) =>
				localStorage.getItem("token") ? (
					Layout ? (
						<Layout>
							<Component {...props} />
						</Layout>
					) : (
						<Component {...props} />
					)
				) : (
					<Redirect
						to={{
							pathname: "/",
						}}
					/>
				)
			}
		/>
	);
};

export const AuthRoute = ({
	component: Component,
	...rest
}: RouteProps): JSX.Element | null => {
	if (!Component) return null;
	return (
		<Route
			{...rest}
			render={(props) =>
				Component === Signin && localStorage.getItem("token") ? (
					<Redirect to="/home" />
				) : (
					<Auth>
						<Component {...props} />
					</Auth>
				)
			}
		/>
	);
};

export const MainRoute = ({
	component: Component,
	protect,
	...rest
}: { protect?: boolean } & RouteProps): JSX.Element | null => {
	if (!Component) return null;
	return protect ? (
		<ProtectedRoute {...rest} component={Component} layout={Main} />
	) : (
		<Route
			{...rest}
			render={(props) => (
				<Main>
					<Component {...props} />
				</Main>
			)}
		/>
	);
};
