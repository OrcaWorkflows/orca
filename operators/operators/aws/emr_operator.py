from operators.base_operator import BaseOperator
from hooks.aws.emr_hook import EMRHook
from configs.system_configs import SystemConfig
from configs.constants import Constants
from logger.log import Logger


class EMROperator(BaseOperator):
    def __init__(self):
        super().__init__()
        if self.configs.operator_source == Constants.emr:
            source_system_config = SystemConfig.get_config(is_source=True)
            self.emr = EMRHook(
                aws_property=source_system_config[Constants.config_property]
            )

    def to_s3(self):
        log_uri = 's3://' + self.configs.aws_s3_bucket_name
        output_uri = 's3://' + self.configs.aws_s3_bucket_name + '/' + self.configs.aws_s3_file_path
        cluster_config = {
            'MasterInstanceType': str(self.configs.aws_emr_master_instance_type),
            'SlaveInstanceType': str(self.configs.aws_emr_slave_instance_type),
            'InstanceCount': int(self.configs.aws_emr_instance_count),
            'KeepJobFlowAliveWhenNoSteps': bool(self.configs.aws_emr_keep_alive)
        }

        input_uri = None

        config_property = SystemConfig.get_config(is_source=True)[Constants.config_property]
        if config_property is not None and \
                "AWS_S3_SOURCE_BUCKET_NAME" in config_property and \
                "AWS_S3_SOURCE_FILE_PATH" in config_property and \
                "AWS_S3_SOURCE_FILE_TYPE" in config_property:
            input_uri = "s3://" + \
                        config_property["AWS_S3_SOURCE_BUCKET_NAME"] + \
                        Constants.divide + \
                        config_property["AWS_S3_SOURCE_FILE_PATH"]
        else:
            Logger.logger.warning("No S3 input has been set as dataset.")
        steps = [
            {
                "name": "Application",
                "script_uri": self.configs.aws_emr_step_script_uri,
                "script_args": ["--data_source", input_uri, "--output_uri", output_uri]
            }
        ]
        cluster_id = self.emr.run_job_flow(
            name=self.configs.aws_emr_cluster_name,
            log_uri=log_uri,
            applications=[self.configs.aws_emr_applications],
            steps=steps,
            cluster_config=cluster_config
        )
        cluster = self.emr.describe_cluster(cluster_id)
        Logger.logger.info("Cluster: %s", str(cluster))

        steps = self.emr.list_steps(cluster_id)
        for step in steps:
            self.emr.wait_step(cluster_id, step["Id"])

        self.emr.terminate_cluster(cluster_id)


