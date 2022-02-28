from configs.configs import ConfigReader
from configs.constants import Constants
from logger.log import Logger
from requests.exceptions import ConnectionError
import requests
import json
import sys


class SystemConfig:
    @staticmethod
    def get_config(is_source: bool):
        configs = ConfigReader()
        headers = {
            "Authorization": "Bearer " + configs.access_token
        }
        if is_source:
            system_config_id = configs.source_system_config_id
        else:
            system_config_id = configs.target_system_config_id
        try:
            res = requests.get(configs.orca_service + Constants.config_api + Constants.divide + system_config_id,
                               headers=headers)
            return res.json()
        except ConnectionError:
            Logger.logger.error("Check if Orca Service parameters correctly given. Or is it running?")
            sys.exit(1)
        except Exception as e:
            Logger.logger.error(e)
            sys.exit(1)

    @staticmethod
    def set_property(config_property, is_source: bool):
        configs = ConfigReader()
        system_config = SystemConfig.get_config(is_source=is_source)
        system_config_property = system_config[Constants.config_property]
        if system_config_property is not None:
            merged_property = {**system_config_property, **config_property}
        else:
            merged_property = config_property
        system_config[Constants.config_property] = merged_property
        res = requests.post(
            configs.orca_service + Constants.config_api,
            headers={
              "Content-Type": "application/json",
              "Authorization": "Bearer " + configs.access_token
            },
            data=json.dumps(system_config)
        )
        if res.status_code != 200:
            raise RuntimeError("Could not set the property. Error : " + res.text)
        else:
            Logger.logger.info("Parameters have been passed.")
