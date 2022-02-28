class KafkaOperations:
    @staticmethod
    def produce_records(producer, topic_name, data):
        producer.send(topic_name, data)
