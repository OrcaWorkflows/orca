from configs.constants import Constants


class ConfigChecker:
    @staticmethod
    def is_key_valid(key):
        return key not in Constants.get_api_check_keys()
