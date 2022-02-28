from readers.csv.reader_csv import ReaderCSV
from readers.csv.reader_json import ReaderJSON


class ReaderGenerator:
    def __init__(self):
        pass

    @staticmethod
    def file_type_switcher(file_type):
        switcher = {
            "csv": ReaderCSV(),
            "json": ReaderJSON()
        }
        return switcher.get(file_type, "Invalid reader type")

    @staticmethod
    def generate(reader_type):
        return ReaderGenerator.file_type_switcher(file_type=reader_type)
