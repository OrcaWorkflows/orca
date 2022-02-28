import { Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";

import { TextField } from "components";

const ChangeOrganizationName = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Typography variant="subtitle2">Enter your new organization name</Typography>
				<TextField
					fieldInputProps={{ ...formik.getFieldProps("new_organization_name") }}
					fieldMetaProps={{ ...formik.getFieldMeta("new_organization_name") }}
					fullWidth
					label="New Organization Name"
					onChange={(event) => {
						event.target.value.length
							? formik.setValues({
									...formik.values,
									emptyOrganizationName: false,
							  })
							: formik.setValues({
									...formik.values,
									emptyOrganizationName: true,
							  });
						formik.getFieldProps("new_organization_name").onChange(event);
					}}
				/>
			</Grid>
		</Grid>
	);
};

export default ChangeOrganizationName;
