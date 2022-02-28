import redis
import ast


class RedisHook:
    def __init__(self, host, db, password):
        self.database = db
        self.redis = redis.Redis(host=host.split(":")[0], port=int(host.split(":")[1]), db=db, password=password)

    def insert_one(self, key, doc: dict):
        self.redis.mset({key: str(doc)})

    def get_one(self, key: bytes) -> dict:
        return ast.literal_eval(self.redis.get(key.decode("utf-8")).decode("utf-8"))

    def get_all_keys(self) -> list:
        keys = list()
        for key in self.redis.scan_iter(match="*"):
            keys.append(key)
        return keys

    def get_all_docs(self) -> list:
        docs = list()
        for key in self.get_all_keys():
            docs.append(self.get_one(key))
        return docs
