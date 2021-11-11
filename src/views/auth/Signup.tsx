import {
	Button,
	Grid,
	Link,
	Typography,
	makeStyles,
	SvgIcon,
} from "@material-ui/core";
import {AxiosError} from "axios";
import { Field, FieldProps, Form, Formik } from "formik";
import { FiLogIn } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import "yup-phone";

import { useSignup, Values } from "actions/auth/useSignup";
import { ReactComponent as OrcaLogo } from "assets/logo/vector/default-monochrome-black.svg";
import { ServerError, TextField } from "components";
import { yup } from "utils";

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
		.matches(
			/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&* ])/,
			"Please put at least one char. of each category below: \n [a-z], [A-Z], [0,9], [[!@#$%^&*]]"
		)
		.min(8),
	phoneNumber: yup
		.string()
		.when("emptyPhoneNumber", (empty) =>
			empty
				? yup.string()
				: yup
						.string()
						.phone("phone", true, "Please use the international format")
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

	const { isError, error, mutate } = useSignup();
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
											fieldInputProps={field}
											fieldMetaProps={meta}
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
											fieldInputProps={field}
											fieldMetaProps={meta}
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
											fieldInputProps={field}
											fieldMetaProps={meta}
											label="Password"
											required
											type="password"
										/>
									)}
								</Field>
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
											fieldInputProps={field}
											fieldMetaProps={meta}
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
											label="Phone Number"
										/>
									)}
								</Field>
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
										<FiLogIn />
									</SvgIcon>
								</Link>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			{isError && <ServerError message={(error as AxiosError)?.response?.data.message} />}
		</>
	);
};

export default Signup;
