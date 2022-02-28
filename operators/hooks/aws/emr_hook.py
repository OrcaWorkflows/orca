from hooks.aws.aws_base_hook import AWSBaseHook
from botocore.exceptions import ClientError, WaiterError
from logger.log import Logger


class EMRHook(AWSBaseHook):
    def __init__(self, aws_property):
        self.client = self.get("emr", aws_property, AWSBaseHook.Client)

    def run_job_flow(self, name, log_uri, applications, steps, cluster_config):
        """
        Runs a job flow with the specified steps. A job flow creates a cluster of
        instances and adds steps to be run on the cluster. Steps added to the cluster
        are run as soon as the cluster is ready.
        :param name: The name of the cluster.
        :param log_uri: The URI where logs are stored. This can be an Amazon S3 bucket URL,
                    such as 's3://my-log-bucket'.
        :param applications: The applications to install on each instance in the cluster,
                         such as Hive or Spark.
        :param steps: The job flow steps to add to the cluster. These are run in order
                  when the cluster is ready.
        :param cluster_config: The cluster configuration as dictionary.
                        - MasterInstanceType
                        - SlaveInstanceType
                        - InstanceCount
                        - KeepJobFlowAliveWhenNoSteps (keepalive): When True, the cluster is put
                        into a Waiting state after all steps are run. When False, the cluster terminates
                        itself when the step queue is empty.
        :return: The ID of the newly created cluster.
        """
        try:
            response = self.client.run_job_flow(
                Name=name,
                LogUri=log_uri,
                ReleaseLabel="emr-5.33.0",
                Instances=cluster_config,
                Steps=[{
                    'Name': step['name'],
                    'ActionOnFailure': 'CONTINUE',
                    'HadoopJarStep': {
                        'Jar': 'command-runner.jar',
                        'Args': ['spark-submit', '--deploy-mode', 'cluster',
                                 step['script_uri'], *step['script_args']]
                    }
                } for step in steps],
                Applications=[{
                    'Name': app
                } for app in applications],
                JobFlowRole="EMR_EC2_DefaultRole",
                ServiceRole="EMR_DefaultRole",
                EbsRootVolumeSize=10,
                VisibleToAllUsers=True
            )
            cluster_id = response['JobFlowId']
            Logger.logger.info("Created cluster %s.", cluster_id)
            Logger.logger.info("EMR Response %s: ", str(dict(response)))
        except ClientError:
            Logger.logger.exception("Couldn't create cluster.")
            raise
        else:
            return cluster_id

    def wait_step(self, cluster_id, step_id):
        try:
            waiter = self.client.get_waiter('step_complete')
            waiter.wait(
                ClusterId=cluster_id,
                StepId=step_id
            )
        except ClientError:
            Logger.logger.exception("Couldn't get waiter for step %s in cluster %s.", step_id, cluster_id)
            raise
        except WaiterError as w:
            Logger.logger.exception("Waiter exception.")
            Logger.logger.exception(str(w))
            raise
        except Exception as e:
            Logger.logger.exception(str(e))
            raise

    def list_steps(self, cluster_id):
        """
        Gets a list of steps for the specified cluster. In this example, all steps are
        returned, including completed and failed steps.

        :param cluster_id: The ID of the cluster.
        :return: The list of steps for the specified cluster.
        """
        try:
            response = self.client.list_steps(ClusterId=cluster_id)
            steps = response['Steps']
        except ClientError:
            Logger.logger.exception("Couldn't get steps for cluster %s.", cluster_id)
            raise
        else:
            return steps

    def describe_cluster(self, cluster_id):
        """
        Gets detailed information about a cluster.

        :param cluster_id: The ID of the cluster to describe.
        :return: The retrieved cluster information.
        """
        try:
            response = self.client.describe_cluster(ClusterId=cluster_id)
            cluster = response['Cluster']
        except ClientError:
            Logger.logger.exception("Couldn't get data for cluster %s.", cluster_id)
            raise
        else:
            return cluster

    def describe_step(self, cluster_id, step_id):
        """
        Gets detailed information about a step in the cluster.

        :param cluster_id: The ID of the cluster which the step is running on.
        :param step_id: The ID of the step to describe.
        :return: The retrieved step information.
        """
        try:
            response = self.client.describe_step(ClusterId=cluster_id, StepId=step_id)
            step = response["Step"]
        except ClientError:
            Logger.logger.exception("Couldn't get data for step %s in the cluster %s.", step_id, cluster_id)
        else:
            return step

    def terminate_cluster(self, cluster_id):
        """
        Terminates a cluster. This terminates all instances in the cluster and cannot
        be undone. Any data not saved elsewhere, such as in an Amazon S3 bucket, is lost.

        :param cluster_id: The ID of the cluster to terminate.
        """
        try:
            self.client.terminate_job_flows(JobFlowIds=[cluster_id])
            Logger.logger.info("Terminated cluster %s.", cluster_id)
        except ClientError:
            Logger.logger.exception("Couldn't terminate cluster %s.", cluster_id)
            raise
