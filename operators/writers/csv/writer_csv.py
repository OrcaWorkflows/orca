import pandas as pd
from writers.base.writer_context import DataType
from writers.base.writer_strategy import WriterStrategy


class WriterCSV(WriterStrategy):
    def write_file(self, data, data_type: DataType):
        if data_type == DataType.JSON:
            return pd.json_normalize(data).to_csv()
        elif data_type == DataType.TUPLE:
            return data.to_csv()
