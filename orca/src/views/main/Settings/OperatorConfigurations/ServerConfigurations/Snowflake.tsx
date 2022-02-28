import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const SnowflakeValidationSchema = yup.object({
    property: yup.object({
        SNOWFLAKE_WAREHOUSE: yup.string().required(),
        SNOWFLAKE_ACCOUNT_IDENTIFIER: yup.string().required(),
    }),
});

const Snowflake = ({
                         formik,
                     }: {
    formik: ReturnType<typeof useFormik>;
}): JSX.Element => {

    return (<>
        <TextField
            fieldInputProps={{
                ...formik.getFieldProps("property.SNOWFLAKE_WAREHOUSE"),
            }}
            fieldMetaProps={{
                ...formik.getFieldMeta("property.SNOWFLAKE_WAREHOUSE"),
            }}
            fullWidth
            label="Warehouse"
            required
        />
        <TextField
            fieldInputProps={{
                ...formik.getFieldProps("property.SNOWFLAKE_ACCOUNT_IDENTIFIER"),
            }}
            fieldMetaProps={{
                ...formik.getFieldMeta("property.SNOWFLAKE_ACCOUNT_IDENTIFIER"),
            }}
            fullWidth
            label="Account Identifier"
            required
        />
    </>)
}

export default Snowflake;
