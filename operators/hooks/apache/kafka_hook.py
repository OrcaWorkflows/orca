from json import dumps, loads

from kafka import KafkaProducer, KafkaConsumer

from configs.config_checker import ConfigChecker


class KafkaHook:
    @staticmethod
    def get_producer(bootstrap_servers, topic):
        bootstrap_servers = [x["host"] for x in bootstrap_servers]
        if ConfigChecker.is_key_valid(bootstrap_servers) and ConfigChecker.is_key_valid(topic):
            return KafkaProducer(bootstrap_servers=bootstrap_servers,
                                 value_serializer=lambda x: dumps(x).encode('utf-8'))
        else:
            return None

    @staticmethod
    def get_consumer(bootstrap_servers, topic):
        if ConfigChecker.is_key_valid(bootstrap_servers) and ConfigChecker.is_key_valid(topic):
            return KafkaConsumer(bootstrap_servers=bootstrap_servers, auto_offset_reset="earliest",
                                 value_deserializer=lambda x: loads(x.decode('utf-8')), consumer_timeout_ms=1000,
                                 enable_auto_commit=True)
        else:
            return None
