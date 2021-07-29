import { PropsWithChildren } from "react";

import { Container } from "@material-ui/core";

const Auth = (props: PropsWithChildren<Record<never, never>>): JSX.Element => (
	<Container maxWidth={false} style={{ height: "100vh" }}>
		<>{props.children}</>
	</Container>
);

export default Auth;
