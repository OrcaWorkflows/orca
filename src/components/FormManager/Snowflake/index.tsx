import { useFormik } from "formik";

import { TextField } from "components";
import { yup } from "utils";

export const SnowflakeValidationSchema = yup.object({
    database: yup.string().required(),
    schema: yup.string().required(),
    table_name: yup.string().required(),
    query: yup.string(),
});

const Snowflake = ({
                   formik,
               }: {
    formik: ReturnType<typeof useFormik>;
}): JSX.Element => (
    <>
        <TextField
            fieldInputProps={{ ...formik.getFieldProps("database") }}
            fieldMetaProps={{ ...formik.getFieldMeta("database") }}
            fullWidth
            label="Database"
            required
        />
        <TextField
            fieldInputProps={{ ...formik.getFieldProps("schema") }}
            fieldMetaProps={{ ...formik.getFieldMeta("schema") }}
            fullWidth
            label="Schema"
            required
        />
        <TextField
            fieldInputProps={{ ...formik.getFieldProps("table_name") }}
            fieldMetaProps={{ ...formik.getFieldMeta("table_name") }}
            fullWidth
            label="Table Name"
            required
        />
        <TextField
            fieldInputProps={{ ...formik.getFieldProps("query") }}
            fieldMetaProps={{ ...formik.getFieldMeta("query") }}
            fullWidth
            label="Query"
            multiline
        />
    </>
);

export default Snowflake;
