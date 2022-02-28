import os
import json
from elasticsearch import Elasticsearch
from operations.elk.elasticsearch_operations import ElasticsearchOperations

from configs.config_checker import ConfigChecker


class ElasticsearchHook:
    @staticmethod
    def get_elasticsearch(hosts, index):
        elasticsearch_max_size = int(os.getenv("ELASTICSEARCH_MAX_SIZE", "25"))
        if ConfigChecker.is_key_valid(hosts) and \
                ConfigChecker.is_key_valid(index):
            return Elasticsearch(hosts, maxsize=elasticsearch_max_size)
        else:
            return None

    @staticmethod
    def query(elasticsearch, index, query, search_limit, scroll):
        data = []
        data_counter = 0
        search_result, scroll_size, scroll_id = ElasticsearchOperations.search(
            elasticsearch,
            index,
            query,
            search_limit,
            scroll)
        while scroll_size > 0:
            for s3_data in search_result['hits']['hits']:
                data_counter += 1
                data.append(json.loads(json.dumps(s3_data["_source"])))
            search_result = elasticsearch.scroll(scroll_id=scroll_id, scroll=scroll)
            scroll_id = search_result['_scroll_id']
            scroll_size = len(search_result['hits']['hits'])
        return data
