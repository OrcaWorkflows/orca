import json
import os

from elasticsearch import helpers

from logger.log import Logger


class ElasticsearchOperations:
    @staticmethod
    def generate_es_data(accumulated_data, index):
        for data in accumulated_data:
            yield {
                "_index": index,
                "_source": data,
            }

    @staticmethod
    def index(elasticsearch, bulk_data, index, timeout):
        res = helpers.bulk(elasticsearch,
                           ElasticsearchOperations.generate_es_data(
                               accumulated_data=bulk_data, index=index), request_timeout=timeout)
        Logger.logger.info("Indexed, " + str(res[0]) + " data.")
        Logger.logger.info(res[1])
        if len(res[1]) > 0:
            Logger.logger.error("Unable to index " + str(res[1]) + " data.")
        bulk_data.clear()

    @staticmethod
    def search(elasticsearch, index, query, search_scroll_size, search_scroll_limit):
        search_result = elasticsearch.search(index=index, size=search_scroll_size, body=query,
                                             scroll=search_scroll_limit)

        scroll_id = search_result['_scroll_id']
        scroll_size = len(search_result['hits']['hits'])

        return search_result, scroll_size, scroll_id
