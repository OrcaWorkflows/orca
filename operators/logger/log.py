import logging
import os


class Logger:
    log_level = os.environ.get("LOGLEVEL", "INFO")
    FORMAT = '%(asctime)-15s %(message)s'
    logging.basicConfig(format=FORMAT, level=log_level)
    logger = logging.getLogger(__name__)
