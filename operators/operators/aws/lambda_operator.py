from operators.base_operator import BaseOperator
from writers.base.writer_context import WriterContext
from writers.base.writer_generator import WriterGenerator
from hooks.aws.lambda_hook import LambdaHook
from hooks.aws.s3_hook import S3Hook
from logger.log import Logger
from configs.system_configs import SystemConfig
from configs.constants import Constants
import json


class LambdaOperator(BaseOperator):
    def __init__(self):
        super().__init__()
        if self.configs.operator_source == Constants.awslambda:
            self.target_system_config = SystemConfig.get_config(is_source=False)
            self.property = SystemConfig.get_config(is_source=True)[Constants.config_property]
            self.aws_lambda = LambdaHook(
                aws_property=self.property
            )

    def to_s3(self):
        s3 = S3Hook(
            aws_property=self.target_system_config[Constants.config_property]
        )

        self.aws_lambda.create_function(
            function_name=self.configs.aws_lambda_function_name,
            run_time=self.configs.aws_lambda_runtime,
            role=self.configs.aws_lambda_role,
            handler=self.configs.aws_lambda_handler,
            code_bucket=self.configs.aws_lambda_code_bucket,
            code_key=self.configs.aws_lambda_code_key
        )

        # Collect input data
        data_json = None
        if self.property is not None and \
                "AWS_S3_SOURCE_BUCKET_NAME" in self.property and \
                "AWS_S3_SOURCE_FILE_PATH" in self.property and \
                "AWS_S3_SOURCE_FILE_TYPE" in self.property:
            data_json = s3.read(
                self.property["AWS_S3_SOURCE_BUCKET_NAME"],
                self.property["AWS_S3_SOURCE_FILE_PATH"],
                self.property["AWS_S3_SOURCE_FILE_TYPE"].lower(),
                self.property["AWS_S3_SOURCE_FILE_TYPE"])

        res_invoke = self.aws_lambda.invoke(
            function_name=self.configs.aws_lambda_function_name,
            payload=self.configs.aws_lambda_payload,
            data=data_json
        )
        Logger.logger.info("Invoke response: " + str(res_invoke))
        response_payload = res_invoke['Payload']
        response_json = json.loads(response_payload.read())
        Logger.logger.info("The function response: " + json.dumps(response_json))
        writer_context = WriterContext(WriterGenerator.generate(writer_type=self.configs.aws_s3_file_type.lower()))
        s3.write_s3(bucket=self.configs.aws_s3_bucket_name,
                    file=self.configs.aws_s3_file_path,
                    data=writer_context.write(data=response_json))
