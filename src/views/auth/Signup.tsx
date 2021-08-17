import {
	Button,
	Grid,
	Link,
	TextField,
	Typography,
	makeStyles,
	SvgIcon,
} from "@material-ui/core";
import { Field, FieldProps, Form, Formik } from "formik";
import { LogIn } from "react-feather";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import "yup-phone";

import { useSignup, Values } from "actions/auth/useSignup";
import { ReactComponent as OrcaLogo } from "assets/logo/vector/default-monochrome-black.svg";
import { ServerError } from "components";

const useStyles = makeStyles({
	fullHeight: { height: "100%" },
	signinLink: {
		"&:hover $signinIcon": {
			transition: "transform 0.3s ease",
			transform: "translateX(10px)",
		},
	},
	signinIcon: {
		verticalAlign: "middle",
	},
});

const signupValidationSchema = yup.object({
	email: yup.string().required().email(),
	username: yup.string().required(),
	password: yup
		.string()
		.required()
		.matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&* ])/)
		.min(8),
	phoneNumber: yup
		.string()
		.when("emptyPhoneNumber", (empty) =>
			empty ? yup.string() : yup.string().phone()
		),
});

const Signup = (): JSX.Element => {
	const classes = useStyles();

	const initialValues = {
		email: "",
		username: "",
		password: "",
		phoneNumber: "",
		emptyPhoneNumber: true,
	};

	const { isError, mutate } = useSignup();
	const handleSubmit = async (values: Values) => mutate(values);

	return (
		<>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnMount
				validationSchema={signupValidationSchema}
			>
				{({ isSubmitting, isValid, values, setValues }) => (
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
								<Field name="email">
									{({
										field,
										meta,
									}: {
										field: FieldProps["field"];
										meta: FieldProps["meta"];
									}) => (
										<TextField
											{...field}
											error={!!(meta.touched && meta.error)}
											label="Email"
											required
										/>
									)}
								</Field>
							</Grid>
							<Grid item>
								<Field name="username">
									{({
										field,
										meta,
									}: {
										field: FieldProps["field"];
										meta: FieldProps["meta"];
									}) => (
										<TextField
											{...field}
											error={!!(meta.touched && meta.error)}
											label="User Name"
											required
										/>
									)}
								</Field>
							</Grid>
							<Grid item>
								<Field name="password">
									{({
										field,
										meta,
									}: {
										field: FieldProps["field"];
										meta: FieldProps["meta"];
									}) => (
										<TextField
											{...field}
											error={!!(meta.touched && meta.error)}
											label="Password"
											required
											type="password"
										/>
									)}
								</Field>
								<Typography display="block" variant="caption">
									Min. 8 characters and at least one of:
								</Typography>
								<Typography display="block" variant="caption">
									[a-z], [A-Z], [0,9], [[!@#$%^&*]]
								</Typography>
							</Grid>
							<Grid item>
								<Field name="phoneNumber">
									{({
										field,
										meta,
									}: {
										field: FieldProps["field"];
										meta: FieldProps["meta"];
									}) => (
										<TextField
											{...field}
											onChange={(event) => {
												event.target.value.length
													? setValues({
															...values,
															emptyPhoneNumber: false,
													  })
													: setValues({
															...values,
															emptyPhoneNumber: true,
													  });
												field.onChange(event);
											}}
											error={!!(meta.touched && meta.error)}
											label="Phone number"
										/>
									)}
								</Field>
								<Typography display="block" variant="caption">
									Please use the international format.
								</Typography>
							</Grid>
							<Grid item>
								<Button disabled={isSubmitting || !isValid} type="submit">
									Sign-up
								</Button>
							</Grid>
							<Grid item>
								<Typography display="inline" variant="subtitle2">
									Already have an account?{" "}
								</Typography>
								<Link
									className={classes.signinLink}
									component={RouterLink}
									to="/"
								>
									Sign in now!{" "}
									<SvgIcon
										className={classes.signinIcon}
										color="secondary"
										fontSize="small"
									>
										<LogIn />
									</SvgIcon>
								</Link>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			{isError && <ServerError />}
		</>
	);
};

export default Signup;
