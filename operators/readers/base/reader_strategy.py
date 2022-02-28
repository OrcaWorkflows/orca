import abc


class ReaderStrategy(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def read_file(self, file):
        pass

    @abc.abstractmethod
    def read_file_as_pandas(self, file):
        pass
