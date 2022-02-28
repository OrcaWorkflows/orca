from operations.elk.elasticsearch_operations import ElasticsearchOperations
from operations.google.bigquery_operations import BigQuery
from operations.google.pubsub_operations import PubSub
from operations.kafka.kafka_operation import KafkaOperations


class Operations:
    def __init__(self):
        self.kafka = KafkaOperations()
        self.elasticsearch = ElasticsearchOperations()
        self.pubsub = PubSub()
        self.bigquery = BigQuery()

    def operation_type_switcher(self, operation_type):
        switcher = {
            "kafka": self.kafka,
            "elasticsearch": self.elasticsearch,
            "pubsub": self.pubsub,
            "bigquery": self.bigquery
        }
        return switcher.get(operation_type, "Invalid operator type")

    def operation(self, operation_type, operation):
        return getattr(self.operation_type_switcher(operation_type=operation_type), operation)
