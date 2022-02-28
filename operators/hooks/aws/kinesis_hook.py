from hooks.aws.aws_base_hook import AWSBaseHook
from utils.utils import datetime_serializer
import json


class KinesisHook(AWSBaseHook):
    def __init__(self, stream_name, aws_property):
        self.kinesis = self.get("kinesis", aws_property, AWSBaseHook.Client)
        self.stream_name = stream_name

    def send_message(self, message):
        data = json.dumps(message, default=datetime_serializer)
        self.kinesis.put_record(StreamName=self.stream_name,
                                Data=data,
                                PartitionKey="id")

    def get_shard_iterator(self):
        shard_id = self.kinesis.describe_stream(StreamName=self.stream_name)["StreamDescription"]["Shards"][0]["ShardId"]
        shard_it = self.kinesis.get_shard_iterator(StreamName=self.stream_name,
                                                   ShardId=shard_id,
                                                   ShardIteratorType="TRIM_HORIZON")["ShardIterator"]
        return shard_it
