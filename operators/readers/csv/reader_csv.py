import pandas as pd

from readers.base.reader_strategy import ReaderStrategy


class ReaderCSV(ReaderStrategy):
    def read_file_as_pandas(self, file):
        return pd.read_csv(file)

    def read_file(self, file):
        csv_file = pd.read_csv(file)
        return csv_file.apply(lambda x: x.to_json(), axis=1)
