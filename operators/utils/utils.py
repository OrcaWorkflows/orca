import json
import pandas as pd
from decimal import Decimal
from datetime import datetime
from bson import ObjectId
try:
    from urlparse import urlparse
except ImportError:
    from urllib.parse import urlparse


def datetime_serializer(obj):
    if isinstance(obj, datetime):
        return obj.__str__()


def legacy_row_to_dict(row, attributes):
    d = dict()
    c = 0
    for attr in attributes:
        d[attr] = row[c]
        c += 1
    return d


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


class ObjectEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super(ObjectEncoder, self).default(o)


class S3Url(object):
    def __init__(self, url):
        self._parsed = urlparse(url, allow_fragments=False)

    @property
    def bucket(self):
        return self._parsed.netloc

    @property
    def key(self):
        if self._parsed.query:
            return self._parsed.path.lstrip('/') + '?' + self._parsed.query
        else:
            return self._parsed.path.lstrip('/')

    @property
    def url(self):
        return self._parsed.geturl()


class JSONDataFrameConverter:
    @staticmethod
    def to_dataframe(data):
        return pd.json_normalize(data)
