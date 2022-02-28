import boto3
from logger.log import Logger
from configs.constants import Constants


class AWSConfig:
    aws_access_key_id = ""
    aws_secret_access_key = ""
    region_name = ""

    def __init__(self, aws_property):
        self.aws_access_key_id = aws_property[Constants.aws_access_key_id]
        self.aws_secret_access_key = aws_property[Constants.aws_access_secret_key]
        self.region_name = aws_property[Constants.aws_region_name]

    def print(self):
        Logger.logger.info(
            "AWS Access Key: " + self.aws_access_key_id + "\n"
            "AWS Region Name: " + self.region_name
        )


class _SessionFactory:
    @staticmethod
    def create_basic_client(client_type, config: AWSConfig) -> boto3.client:
        Logger.logger.info("Creating AWS client.")
        return boto3.client(client_type,
                            aws_access_key_id=config.aws_access_key_id,
                            aws_secret_access_key=config.aws_secret_access_key,
                            region_name=config.region_name)

    @staticmethod
    def create_basic_resource(resource_type, config: AWSConfig) -> boto3.resource:
        Logger.logger.info("Creating AWS resource.")
        return boto3.resource(resource_type,
                              aws_access_key_id=config.aws_access_key_id,
                              aws_secret_access_key=config.aws_secret_access_key,
                              region_name=config.region_name)


class AWSBaseHook:
    Client = "client"
    Resource = "resource"

    @staticmethod
    def get(type_name, aws_property, session_type):
        if session_type == "client":
            return _SessionFactory().create_basic_client(type_name, AWSConfig(aws_property))
        elif session_type == "resource":
            return _SessionFactory().create_basic_resource(type_name, AWSConfig(aws_property))
        else:
            raise RuntimeError("Undefined AWS Session type.")
