import abc
from writers.base.data_type import DataType


class WriterStrategy(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def write_file(self, data, data_type: DataType):
        pass
