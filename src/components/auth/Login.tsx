import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
// import {
// 	NotificationContainer,
// 	// NotificationManager,
// } from "react-notifications";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

import { signinUser } from "actions/auth_actions";
import { ReactComponent as OrcaLogo } from "assets/logo/vector/default-monochrome-black.svg";

// import { notificationTimeoutMillis } from "../../config";

const useStyles = makeStyles({
	fullHeight: { height: "100%" },
});

const loginValidationSchema = yup.object({
	username: yup.string().required("Zorunlu alan"),
	password: yup.string().required("Zorunlu alan"),
});

const Login = (): JSX.Element => {
	const classes = useStyles();

	const initialValues = {
		username: "",
		password: "",
	};
	const history = useHistory();
	const handleSubmit = (values: any, actions: any) => {
		actions.setSubmitting(false);
		signinUser(values["username"], values["password"], history);
	};

	// const handleRegister = () => {
	// 	NotificationManager.error(
	// 		"Registration is Closed. Please Try again later.",
	// 		"Error",
	// 		notificationTimeoutMillis
	// 	);
	// };

	return (
		<>
			{/* <NotificationContainer /> */}
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnMount
				validationSchema={loginValidationSchema}
			>
				{({ isSubmitting, isValid }) => (
					<Form className={classes.fullHeight}>
						<Grid
							className={classes.fullHeight}
							container
							direction="column"
							alignItems="center"
							justifyContent="center"
							spacing={2}
						>
							<Grid item>
								<OrcaLogo title="ORCA" />
							</Grid>
							<Grid item>
								<Field name="username">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												helperText={meta.touched && meta.error}
												label="User Name"
												required
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Field name="password">
									{({ field, meta }: { field: any; meta: any }) => {
										return (
											<TextField
												{...field}
												error={!!(meta.touched && meta.error)}
												helperText={meta.touched && meta.error}
												label="Password"
												required
												type="password"
											/>
										);
									}}
								</Field>
							</Grid>
							<Grid item>
								<Button disabled={isSubmitting || !isValid} type="submit">
									Login
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default Login;
