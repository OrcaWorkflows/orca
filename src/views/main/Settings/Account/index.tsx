import {
	Button,
	Divider,
	Grid,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";

// import { useQueryClient } from "react-query";

import { useUpdateUser } from "actions/auth/useUpdateUser";
import { useUserMe } from "actions/auth/useUserMe";
import { ServerError } from "components";
import ChangeEmail from "views/main/Settings/Account/ChangeEmail";
import ChangePassword from "views/main/Settings/Account/ChangePassword";
import ChangePhoneNumber from "views/main/Settings/Account/ChangePhoneNumber";

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
	paper: {
		padding: theme.spacing(1),
	},
}));

const accountValidationSchema = yup.object({
	new_email: yup
		.string()
		.email("Please use a correct email format")
		.test("condRequired", "New Email is a required field", function (value) {
			const { email } = this.parent;
			if (email) return value !== undefined;
			return true;
		}),
	password: yup
		.string()
		.test("condRequired", "Password is a required field", function (value) {
			const { new_password } = this.parent;
			if (new_password) return value !== undefined;
			return true;
		})
		.test("condRequired", "Password is a required field", function (value) {
			const { reentered_new_password } = this.parent;
			if (reentered_new_password) return value !== undefined;
			return true;
		}),
	new_password: yup
		.string()
		.test("condRequired", "New Password is a required field", function (value) {
			const { password } = this.parent;
			if (password) return value !== undefined;
			return true;
		})
		.test("condRequired", "New Password is a required field", function (value) {
			const { reentered_new_password } = this.parent;
			if (reentered_new_password) return value !== undefined;
			return true;
		})
		.test("equal", "Passwords must match", function (value) {
			const { reentered_new_password } = this.parent;
			if (reentered_new_password) return value === reentered_new_password;
			return true;
		}),
	reentered_new_password: yup
		.string()
		.test("condRequired", "New Password is a required field", function (value) {
			const { password } = this.parent;
			if (password) return value !== undefined;
			return true;
		})
		.test("condRequired", "New Password is a required field", function (value) {
			const { new_password } = this.parent;
			if (new_password) return value !== undefined;
			return true;
		})
		.test("equal", "Passwords must match", function (value) {
			const { new_password } = this.parent;
			if (new_password) return value === new_password;
			return true;
		}),
	new_phone_number: yup
		.string()
		.when("emptyPhoneNumber", (empty) =>
			empty
				? yup.string()
				: yup
						.string()
						.phone("phone", true, "Please use the international format")
		),
});

export const Account = (): JSX.Element => {
	const classes = useStyles();

	const { isError: isErrorUpdateUser, mutateAsync: updateUser } =
		useUpdateUser();

	const initialValues: any = {
		new_email: "",
		password: "",
		new_password: "",
		reentered_new_password: "",
		new_phone_number: "",
		emptyPhoneNumber: true,
	};

	const handleSubmit = async (values: typeof initialValues) => {
		return updateUser({
			...(values.new_email ? { email: values.new_email } : {}),
			...(values.new_password ? { password: values.new_password } : {}),
			...(values.new_phone_number
				? { phoneNumber: values.new_phone_number }
				: {}),
		});
	};

	const formik = useFormik<typeof initialValues>({
		initialValues,
		enableReinitialize: true,
		onSubmit: handleSubmit,
		validateOnMount: true,
		validationSchema: accountValidationSchema,
	});

	const { data: userMe, isError: isErrorUserMe } = useUserMe();

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<Typography gutterBottom variant="subtitle2">
						Update your account
					</Typography>
					<Typography className={classes.bold} variant="h4">
						{localStorage.getItem("username")}
					</Typography>
					{userMe?.email && (
						<Typography variant="caption">{userMe?.email}</Typography>
					)}
				</Grid>
				<Grid item xs>
					<Typography className={classes.bold} gutterBottom variant="h6">
						Change your email
					</Typography>
					<Divider />
					<ChangeEmail formik={formik} />
				</Grid>
				<Grid item xs>
					<Typography className={classes.bold} gutterBottom variant="h6">
						Change your password
					</Typography>
					<Divider />
					<ChangePassword formik={formik} />
				</Grid>
				<Grid item xs>
					<Typography className={classes.bold} gutterBottom variant="h6">
						Change your phone number
					</Typography>
					<Divider />
					<ChangePhoneNumber formik={formik} />
				</Grid>
				<Grid item>
					<Button
						disabled={formik.isSubmitting || !formik.isValid}
						size="small"
						type="submit"
					>
						SAVE
					</Button>
				</Grid>
			</Grid>
			{isErrorUpdateUser && <ServerError />}
			{isErrorUserMe && (
				<ServerError message="We've met an *unexpected server error* while retrieving the user information!" />
			)}
		</form>
	);
};

export default Account;
