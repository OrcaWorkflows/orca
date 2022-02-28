import snowflake.connector
from sqlalchemy import create_engine


class SnowflakeHook:
    def __init__(self, snowflake_username, snowflake_password, snowflake_account, database, snowflake_schema,
                 snowflake_warehouse):
        self.ctx = snowflake.connector.connect(
            user=snowflake_username,
            password=snowflake_password,
            account=snowflake_account,
            database=database,
            schema=snowflake_schema
        )
        self.alchemy_engine = create_engine(
            'snowflake://{user}:{password}@{account}/{db}/{schema}?warehouse={warehouse}'.format(
                user=snowflake_username,
                password=snowflake_password,
                account=snowflake_account,
                db=database,
                schema=snowflake_schema,
                warehouse=snowflake_warehouse
            )
        )

    def execute(self, statement):
        cs = self.ctx.cursor()
        try:
            cs.execute(statement)
            return cs.fetch_pandas_all()
        finally:
            cs.close()
            self.ctx.close()

    def write(self, data, table_name):
        data.to_sql(table_name, con=self.alchemy_engine, index=False, if_exists='append', chunksize=100)
