from writers.base.data_type import DataType


class WriterContext:

    def __init__(self, writer_strategy):
        self.writer_strategy = writer_strategy

    def write(self, data, data_type=DataType.JSON):
        return self.writer_strategy.write_file(data=data, data_type=data_type)
