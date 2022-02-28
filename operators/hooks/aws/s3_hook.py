from hooks.aws.aws_base_hook import AWSBaseHook
from readers.base.reader_context import ReaderContext
from readers.base.reader_generator import ReaderGenerator
from logger.log import Logger
import io


class S3Hook(AWSBaseHook):
    def __init__(self, aws_property):
        self.client = self.get("s3",  aws_property, AWSBaseHook.Client)

    def _read_s3(self, bucket, file):
        obj = self.client.get_object(Bucket=bucket, Key=file)
        return io.BytesIO(obj['Body'].read())

    def read(self, aws_bucket_name, aws_file_path, aws_file_type, read_type="GENERAL"):
        reader_context = ReaderContext(ReaderGenerator.generate(aws_file_type))
        if read_type == "PANDAS":
            read_file = reader_context.read_pandas(
                file=self._read_s3(bucket=aws_bucket_name, file=aws_file_path))
        else:
            read_file = reader_context.read(file=self._read_s3(bucket=aws_bucket_name, file=aws_file_path))

        return read_file

    def write_s3(self, bucket, file, data):
        self.client.put_object(Body=data, Bucket=bucket, Key=file)
