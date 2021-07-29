import { FunctionComponent } from "react";

import { Route, Redirect, RouteProps } from "react-router-dom";

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

export default ProtectedRoute;
