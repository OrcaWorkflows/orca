import {
	Button,
	Divider,
	Grid,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { useFormik } from "formik";

// import { useQueryClient } from "react-query";

import { useUpdateUser } from "actions/auth/useUpdateUser";
import { ServerError } from "components";
import { yup } from "utils";
import ChangeEmail from "views/main/Settings/Account/ChangeEmail";
import ChangeOrganizationName from "views/main/Settings/Account/ChangeOrganizatinonName";
import ChangePassword from "views/main/Settings/Account/ChangePassword";

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
	new_organization_name: yup.string(),
});

export const Account = (): JSX.Element => {
	const classes = useStyles();

	const user = JSON.parse(localStorage.getItem("user") as string);

	const { isError: isErrorUpdateUser, mutateAsync: updateUser } =
		useUpdateUser();

	const initialValues: any = {
		new_email: "",
		password: "",
		new_password: "",
		reentered_new_password: "",
		new_organization_name: "",
		emptyOrganizationName: true,
	};

	const handleSubmit = async (values: typeof initialValues) => {
		return updateUser({
			...(values.new_email ? { email: values.new_email } : {}),
			...(values.new_password ? { password: values.new_password } : {}),
			...(values.new_organization_name
				? { organizationName: values.new_organization_name }
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

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<Typography gutterBottom variant="subtitle2">
						Update your account
					</Typography>
					<Typography className={classes.bold} variant="h4">
						{user.username}
					</Typography>
					{user.email && (
						<Typography variant="caption">{user.email}</Typography>
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
						Change your organization name
					</Typography>
					<Divider />
					<ChangeOrganizationName formik={formik} />
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
		</form>
	);
};

export default Account;
