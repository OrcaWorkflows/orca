from configs.configs import ConfigReader
from operations.operation_factory import Operations


class BaseOperator:
    def __init__(self):
        self.configs = ConfigReader()
        self.operations = Operations()
