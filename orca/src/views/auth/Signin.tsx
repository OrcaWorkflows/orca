import {
	Button,
	Grid,
	Link,
	SvgIcon,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { Field, FieldProps, Form, Formik } from "formik";
import { FiKey } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

import { useSignin, Values } from "actions/auth/useSignin";
import { ReactComponent as OrcaLogo } from "assets/logo/vector/default-monochrome-black.svg";
import { Alert, TextField } from "components";
import { yup } from "utils";

const useStyles = makeStyles((theme) => ({
	fullHeight: { height: "100%" },
	signupLink: {
		"&:hover $signupIcon": {
			transition: "transform 0.3s ease",
			transform: "translateX(10px)",
		},
	},
	signupIcon: {
		verticalAlign: "middle",
	},
	paper: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.error.main,
		padding: theme.spacing(1),
	},
}));

const signinValidationSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().required(),
});

const Signin = (): JSX.Element => {
	const classes = useStyles();

	const initialValues = {
		username: "",
		password: "",
	};

	const { isError, mutate } = useSignin();
	const handleSubmit = async (values: Values) => mutate(values);

	return (
		<>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnMount
				validationSchema={signinValidationSchema}
			>
				{({ isSubmitting, isValid }) => (
					<Form className={classes.fullHeight}>
						<Grid
							className={classes.fullHeight}
							container
							direction="column"
							alignItems="center"
							justifyContent="center"
							spacing={1}
						>
							<Grid item>
								<OrcaLogo title="ORCA" />
							</Grid>
							<Grid item>
								<Field name="username">
									{({
										field,
										meta,
									}: {
										field: FieldProps["field"];
										meta: FieldProps["meta"];
									}) => {
										return (
											<TextField
												fieldInputProps={field}
												fieldMetaProps={meta}
												label="User Name"
												required
											/>
										);
									}}
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
									}) => {
										return (
											<TextField
												fieldInputProps={field}
												fieldMetaProps={meta}
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
									Sign-in
								</Button>
							</Grid>
							<Grid item>
								<Typography display="inline" variant="subtitle2">
									Don&apos;t have an account?{" "}
								</Typography>
								<Link
									className={classes.signupLink}
									component={RouterLink}
									to="/signup"
								>
									Sign up now!{" "}
									<SvgIcon
										className={classes.signupIcon}
										color="secondary"
										fontSize="small"
									>
										<FiKey />
									</SvgIcon>
								</Link>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			{isError && (
				<Alert
					message="Please check your credentials and try again."
					severity="error"
				/>
			)}
		</>
	);
};

export default Signin;
