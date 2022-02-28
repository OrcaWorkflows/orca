from sqlalchemy import create_engine, Table, MetaData, text
from utils.utils import legacy_row_to_dict
import urllib.parse
from logger.log import Logger
import json


class SQLHook:
    pymysql_dialects = ["mysql", "mariadb"]
    mssql_dialects = ["mssql"]
    oracle_dialects = ["oracle"]

    def __init__(self, dialect, host, database, username, password, table_name):
        # database url : dialect+driver://username:password@host:port/database
        parsed_password = urllib.parse.quote_plus(password)
        if dialect in self.pymysql_dialects:
            dialect += "+pymysql"
        elif dialect in self.mssql_dialects:
            dialect += "+pyodbc"
        elif dialect in self.oracle_dialects:
            dialect += "+cx_oracle"
        database_url = dialect + "://" + username + ":" + parsed_password + "@" + host +\
                       "/" + database

        self.engine = create_engine(database_url)
        self.table_name = table_name

    def execute(self, sql_text):
        data = list()
        with self.engine.connect().execution_options(autocommit=True) as connection:
            attributes = connection.execute(text(sql_text)).keys()
            result = connection.execute(text(sql_text))
            for line in result:
                line_as_dict = legacy_row_to_dict(line, attributes)
                data.append(line_as_dict)
        return data

    def insert(self, data):
        try:
            with self.engine.connect().execution_options(autocommit=True) as connection:
                with connection.begin():
                    meta = MetaData()
                    table = Table(self.table_name, meta, autoload_with=connection)
                    connection.execute(table.insert(), data)
        except Exception as e:
            Logger.logger.error(e)

    def insert_bulk(self, data):
        with self.engine.connect().execution_options(autocommit=True) as connection:
            with connection.begin():
                meta = MetaData()
                meta.reflect(self.engine, only=[self.table_name])
                table = Table(self.table_name, meta, autoload=True, autoload_with=connection)
                connection.execute(table.insert(), data)
