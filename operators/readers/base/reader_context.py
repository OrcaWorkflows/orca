

class ReaderContext:

    def __init__(self, reader_strategy):
        self.reader_strategy = reader_strategy

    def read(self, file):
        return self.reader_strategy.read_file(file=file)

    def read_pandas(self, file):
        return self.reader_strategy.read_file_as_pandas(file=file)
