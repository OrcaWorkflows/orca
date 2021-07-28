import { PropsWithChildren } from "react";

import { Container } from "@material-ui/core";

import Header from "layouts/Main/Header";

const Main = (props: PropsWithChildren<Record<never, never>>): JSX.Element => (
	<Container maxWidth={false} style={{ minHeight: "100vh" }}>
		<Header />
		{props.children}
	</Container>
);

export default Main;
