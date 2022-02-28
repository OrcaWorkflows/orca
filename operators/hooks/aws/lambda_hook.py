from hooks.aws.aws_base_hook import AWSBaseHook
from botocore.exceptions import ClientError
from logger.log import Logger
import json


class LambdaHook(AWSBaseHook):
    def __init__(self, aws_property):
        self.client = self.get("lambda", aws_property, AWSBaseHook.Client)

    def create_function(self, function_name, run_time, role, handler, code_bucket, code_key):
        try:
            return self.client.create_function(
                FunctionName=function_name,
                Runtime=run_time,
                Role=role,
                Handler=handler,
                Code={
                    "S3Bucket": code_bucket,
                    "S3Key": code_key
                },
                Publish=True
            )
        except ClientError as e:
            Logger.logger.exception("Couldn't create Lambda function. Error: " + str(e))

    def invoke(self, function_name, payload: str, data):
        try:
            payload_json = json.loads(payload)
            payload_json["data"] = data
            return self.client.invoke(
                FunctionName=function_name,
                Payload=json.dumps(payload_json).encode('utf-8'),
                Qualifier="$LATEST"
            )
        except ClientError as e:
            Logger.logger.exception("Couldn't invoke Lambda function. Error: " + str(e))
