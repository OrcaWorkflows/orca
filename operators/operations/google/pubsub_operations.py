from google.api_core.exceptions import AlreadyExists, NotFound
from google.cloud import pubsub_v1

from logger.log import Logger


class PubSub:
    @staticmethod
    def create_topic(publisher_client, topic_path):
        try:
            publisher_client.create_topic(name=topic_path)
        except AlreadyExists:
            Logger.logger.warning("Topic Exists!! Continuing...")
            return
        Logger.logger.info("Topic Created " + str(topic_path))

    @staticmethod
    def create_subscription(subscription_path, topic_path):
        with pubsub_v1.SubscriberClient() as subscriber_client:
            try:
                subscriber_client.create_subscription(name=subscription_path, topic=topic_path)
            except AlreadyExists or NotFound as ex:
                if ex.grpc_status_code.name == "NOT_FOUND":
                    Logger.logger.error("Subscription doesn't exist! Stopping...")
                elif ex.grpc_status_code.name == "ALREADY_EXISTS":
                    Logger.logger.warning("Subscription exists!! Continuing...")
                return
            Logger.logger.info("Subscription Created " + str(subscription_path))

    @staticmethod
    def delete_props(publisher_client, subscription_path, topic_path):
        with pubsub_v1.SubscriberClient() as subscriber_client:
            try:
                subscriber_client.delete_subscription(request={"subscription": subscription_path})
                publisher_client.delete_topic(request={"topic": topic_path})
            except NotFound:
                Logger.logger.warning("Subscription not found!! Continuing...")
