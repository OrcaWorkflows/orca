from pymongo import MongoClient
from logger.log import Logger
import json


class MongoDBHook:
    def __init__(self, host, db_name, collection_name):
        self.client = MongoClient(host=host.split(":")[0], port=int(host.split(":")[1]))
        if db_name is not None:
            self.db = self.client[db_name]
            self.collection_name = collection_name

    def get_all(self):
        return self.db[self.collection_name].find({}, {'_id': False})

    def get(self, filter_arg):
        if isinstance(filter_arg, dict):
            return self.db[self.collection_name].find(filter_arg, {'_id': False})
        else:
            return self.db[self.collection_name].find(json.loads(filter_arg), {'_id': False})

    def insert_bulk(self, docs):
        res = self.db[self.collection_name].insert_many(docs)
        Logger.logger.info("Inserted " + str(len(res.inserted_ids)) + " docs to MongoDB.")

    def insert(self, doc):
        self.db[self.collection_name].insert_one(doc)
