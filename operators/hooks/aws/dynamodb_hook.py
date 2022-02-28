from hooks.aws.aws_base_hook import AWSBaseHook
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from logger.log import Logger


class DynamoDBHook(AWSBaseHook):
    def __init__(self, table_name, aws_property):
        self.dynamo_db = self.get("dynamodb", aws_property, AWSBaseHook.Resource)
        try:
            self.table = self.dynamo_db.Table(table_name)
        except ClientError:
            Logger.logger.error("Error while creating DynamoDB table.")
            raise

    def create_item(self, item):
        try:
            self.table.put_item(
                Item=item
            )
        except ClientError:
            Logger.logger.error("Could not create item to DynamoDB. Item: " + str(item))
            raise

    def get_item(self, key):
        try:
            response = self.table.get_item(
                Key=key
            )
            return response["Item"]
        except ClientError:
            Logger.logger.error("Could not get item from DynamoDB. Requested key: " + str(key))
            raise

    def delete_item(self, key):
        try:
            self.table.delete_item(
                Key=key
            )
        except ClientError:
            Logger.logger.error("Could not delete item from DynamoDB. Requested key: " + str(key))
            raise

    def batch_write(self, items):
        try:
            with self.table.batch_writer() as batch:
                for item in items:
                    batch.put_item(
                        Item=item
                    )
            return True
        except ClientError as error:
            Logger.logger.error("Failed to insert items in DynamoDB. Error: " + str(error))
            raise

    def get_all(self):
        done = False
        start_key = None

        scan_kwargs = dict()
        data = list()

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = self.dynamo_db.table.scan(**scan_kwargs)
            for item in response.get('Items', []):
                data.append(item)
            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        return data

    def query(self, key, value):
        try:
            response = self.table.query(
                KeyConditionExpression=Key(key).eq(value)
            )
            items = response["Items"]
            return items
        except ClientError:
            Logger.logger.error("Could not get items from DynamoDB. Requested key, value: " + str(key) + " , " +
                                str(value))
            raise
