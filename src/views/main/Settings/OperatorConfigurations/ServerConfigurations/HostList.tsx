import { Fragment } from "react";

import { IconButton } from "@material-ui/core";
import {
	useFormik,
	FormikProvider,
	FieldArray,
	FieldArrayRenderProps,
} from "formik";
import { Plus, Delete } from "react-feather";
import * as yup from "yup";

import { TextField } from "components";
import * as serverConfigurationsInitialData from "utils/serverConfigurationsInitialData";

/* eslint @typescript-eslint/no-var-requires: "off" */
const ipRegex = require("ip-regex");

export const hostListValidationSchema = yup.object({
	hostList: yup.array().of(
		yup.object({
			host: yup
				.string()
				.matches(ipRegex(), "Please use {IPv4 | IPv6}:PORT format")
				.required("Please use {IPv4 | IPv6}:PORT format"),
		})
	),
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
									<TextField
										fieldInputProps={{
											...formik.getFieldProps(`hostList.${index}.host`),
										}}
										fieldMetaProps={{
											...formik.getFieldMeta(`hostList.${index}.host`),
										}}
										InputProps={{
											endAdornment: (
												<IconButton
													disabled={formik.values.hostList.length === 1}
													onClick={() => remove(index)}
												>
													<Delete />
												</IconButton>
											),
										}}
										fullWidth
										label="Host"
										required
									/>
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
