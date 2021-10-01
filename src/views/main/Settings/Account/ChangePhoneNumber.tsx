import { Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";

import { TextField } from "components";

const ChangePhoneNumber = ({
	formik,
}: {
	formik: ReturnType<typeof useFormik>;
}): JSX.Element => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Typography variant="subtitle2">Enter your new phone number</Typography>
				<TextField
					fieldInputProps={{ ...formik.getFieldProps("new_phone_number") }}
					fieldMetaProps={{ ...formik.getFieldMeta("new_phone_number") }}
					fullWidth
					label="New Phone Number"
					onChange={(event) => {
						event.target.value.length
							? formik.setValues({
									...formik.values,
									emptyPhoneNumber: false,
							  })
							: formik.setValues({
									...formik.values,
									emptyPhoneNumber: true,
							  });
						formik.getFieldProps("new_phone_number").onChange(event);
					}}
				/>
			</Grid>
		</Grid>
	);
};

export default ChangePhoneNumber;
