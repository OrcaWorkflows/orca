import json

from google.api_core.exceptions import Conflict
from google.cloud import bigquery

from configs.config_checker import ConfigChecker
from logger.log import Logger


class BigQuery:
    @staticmethod
    def load_table(bigquery_client, data_frame, table_id):
        job_config = bigquery.LoadJobConfig(
            write_disposition="WRITE_TRUNCATE",
        )
        job = bigquery_client.load_table_from_dataframe(
            data_frame, table_id, job_config=job_config
        )
        job.result()
        table = bigquery_client.get_table(table_id)  # Make an API request.
        Logger.logger.info(
            "Loaded {} rows and {} columns to {}".format(table.num_rows, len(table.schema), table_id)
        )
        return table.num_rows

    @staticmethod
    def create_dataset(bigquery_client, dataset_id):
        dataset = bigquery.Dataset(dataset_id)
        try:
            dataset = bigquery_client.create_dataset(dataset)
        except Conflict:
            Logger.logger.warning("Dataset exists!! Continuing...")
            return
        Logger.logger.info("Created dataset {}.{}".format(bigquery_client.project, dataset.dataset_id))

    @staticmethod
    def convert_to_table(project_id, dataset_id, table_id):
        return str(project_id) + "." + str(dataset_id) + "." + str(table_id)

    @staticmethod
    def convert_to_dataset(project_id, dataset_id):
        return str(project_id) + "." + str(dataset_id)

    @staticmethod
    def clean_fields(data_frame):
        clean_columns = []
        for column in data_frame.columns:
            clean_columns.append(''.join(e for e in column if e.isalnum()))
        data_frame.columns = clean_columns
        return data_frame

    @staticmethod
    def retrieve_table(bigquery_client, query, project_id, dataset_id, table_id):
        if ConfigChecker.is_key_valid(query):
            df = bigquery_client.query(query).to_dataframe()
        else:
            dataset_ref = bigquery_client.dataset(dataset_id, project=project_id)
            table_ref = dataset_ref.table(table_id)
            table = bigquery_client.get_table(table_ref)

            df = bigquery_client.list_rows(table).to_dataframe()
        return df.apply(lambda x: json.loads(x.to_json()), axis=1).to_list()
