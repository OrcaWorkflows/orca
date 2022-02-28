from readers.base.reader_strategy import ReaderStrategy
import pandas as pd
import io
import json


class ReaderJSON(ReaderStrategy):
    def read_file(self, file: io.BytesIO):
        json_data = json.loads(file.read())
        return json_data

    def read_file_as_pandas(self, file):
        return pd.read_json(file)
