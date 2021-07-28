import { Route, RouteProps } from "react-router-dom";

import ProtectedRoute from "components/ProtectedRoute";
import Auth from "layouts/Auth";
import Main from "layouts/Main";

export const AuthRoute = ({
	component: Component,
	...rest
}: RouteProps): JSX.Element | null => {
	if (!Component) return null;
	return (
		<Route
			{...rest}
			render={(props) => (
				<Auth>
					<Component {...props} />
				</Auth>
			)}
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
