import { Fragment } from "react";

import { Grid, IconButton, TextField } from "@material-ui/core";
import {
	useFormik,
	FormikProvider,
	FieldArray,
	FieldArrayRenderProps,
} from "formik";
import { Plus, Delete } from "react-feather";
import * as yup from "yup";

import * as serverConfigurationsInitialData from "utils/serverConfigurationsInitialData";

export const hostListValidationSchema = yup.object({
	hostList: yup
		.array()
		.of(
			yup.object({
				host: yup.string().required(),
			})
		)
		.min(1)
		.required(),
});

const HostList = ({
	formik,
	operatorName,
}: {
	formik: ReturnType<typeof useFormik>;
	operatorName: string;
}): JSX.Element => (
	<FormikProvider value={formik}>
		<FieldArray name="hostList">
			{({ remove, push }: FieldArrayRenderProps) => (
				<Fragment>
					{formik.values.hostList.length > 0 &&
						formik.values.hostList.map(
							(_host: { host: string; port: string }, index: number) => (
								<Fragment key={index}>
									<Grid container alignItems="center" spacing={1}>
										<Grid item>
											<TextField
												{...formik.getFieldProps(`hostList.${index}.host`)}
												error={
													!!(
														formik.getFieldMeta(`hostList.${index}.host`)
															.touched &&
														formik.getFieldMeta(`hostList.${index}.host`).error
													)
												}
												fullWidth
												label="Host"
												margin="dense"
												required
											/>
										</Grid>
										<Grid item>
											<IconButton
												disabled={formik.values.hostList.length === 1}
												onClick={() => remove(index)}
											>
												<Delete />
											</IconButton>
										</Grid>
									</Grid>
								</Fragment>
							)
						)}
					<IconButton
						onClick={() =>
							push({
								host: `:${
									(
										serverConfigurationsInitialData[
											operatorName as keyof typeof serverConfigurationsInitialData
										] as any
									)?.port ?? ""
								}`,
							})
						}
					>
						<Plus />
					</IconButton>
				</Fragment>
			)}
		</FieldArray>
	</FormikProvider>
);

export default HostList;
