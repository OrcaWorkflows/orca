from writers.csv.writer_csv import WriterCSV


class WriterGenerator:
    def __init__(self):
        pass

    @staticmethod
    def file_type_switcher(file_type):
        switcher = {
            "csv": WriterCSV()
        }
        return switcher.get(file_type, "Invalid reader type")

    @staticmethod
    def generate(writer_type):
        return WriterGenerator.file_type_switcher(file_type=writer_type)
