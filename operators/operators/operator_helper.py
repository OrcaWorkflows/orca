from google.cloud import pubsub_v1, bigquery
from google.cloud.pubsub_v1 import types
from operators.base_operator import BaseOperator


class HelperOperator(BaseOperator):

    def __init__(self):
        super().__init__()
        self.helper_operator_data_counter = 0

    def index_remain_elasticsearch_data(self, elasticsearch, bulk_data, index):
        if len(bulk_data) > 0:
            self.operations.operation(self.configs.operator_target, "index")(elasticsearch, bulk_data, index,
                                                                             self.configs.elasticsearch_timeout)
            bulk_data.clear()

    def create_pubsub_props(self):
        publisher_client = pubsub_v1.PublisherClient()
        subscriber_client = pubsub_v1.SubscriberClient()

        topic_path = publisher_client.topic_path(
            self.configs.google_pubsub_project_id, self.configs.google_pubsub_topic
        )

        subscription_path = subscriber_client.subscription_path(
            self.configs.google_pubsub_project_id, self.configs.google_pubsub_topic
        )

        self.operations.operation(self.configs.operator_target, "create_topic")(publisher_client, topic_path)
        self.operations.operation(self.configs.operator_target, "create_subscription")(subscription_path, topic_path)

    def initiate_pubsub(self):
        publisher_client = pubsub_v1.PublisherClient(
            batch_settings=types.BatchSettings(max_bytes=self.configs.google_pubsub_bytes,
                                               max_latency=self.configs.google_pubsub_latency,
                                               max_messages=self.configs.google_pubsub_batch_size),
            publisher_options=pubsub_v1.types.PublisherOptions(
                flow_control=pubsub_v1.types.PublishFlowControl(
                    message_limit=self.configs.google_pubsub_batch_size,
                    byte_limit=self.configs.google_pubsub_bytes,
                    limit_exceeded_behavior=pubsub_v1.types.LimitExceededBehavior.BLOCK,
                ),
                enable_message_ordering=False
            )
        )

        topic_path = publisher_client.topic_path(
            self.configs.google_pubsub_project_id, self.configs.google_pubsub_topic
        )

        self.create_pubsub_props()

        return publisher_client, topic_path

    def pubsub_publish_callback(self, future):
        future.result()
        self.helper_operator_data_counter += 1

    def initiate_bigquery(self):
        bigquery_client = bigquery.Client()

        dataset = self.operations.operation(self.configs.operator_target, "convert_to_dataset")(
            self.configs.google_bigquery_project_id,
            self.configs.google_bigquery_dataset_id)

        self.operations.operation(self.configs.operator_target, "create_dataset")(
            bigquery_client,
            dataset)

        table = self.operations.operation(self.configs.operator_target, "convert_to_table")(
            self.configs.google_bigquery_project_id,
            self.configs.google_bigquery_dataset_id,
            self.configs.google_bigquery_table_id)

        return bigquery_client, table
