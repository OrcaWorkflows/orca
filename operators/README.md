<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://orcaworkflows.com">
    <img src="orca/public/logo_simple.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Orca Workflows</h3>

  <p align="center">
    No-code data orchestration platform.
    <br />
    <a href="https://orcaworkflows.com"><strong>Explore»</strong></a>
    <br />
    <br />
    <a>
    This is OrcaWorkflows' operators repository. Please refer to below for
    other components.
    </a>
    <br />
    <a href="https://github.com/OrcaWorkflows/orca/service">Orca Service</a>
    |
    <a href="https://github.com/OrcaWorkflows/orca/charts">Orca Charts</a>
    |
    <a href="https://github.com/OrcaWorkflows/orca/orca">Orca</a>
    <br />
    <br />
    <a href="https://www.orcaworkflows.com/#about">View Demo</a>
    ·
    <a href="https://github.com/OrcaWorkflows/orca/issues">Report Bug</a>
    ·
    <a href="https://github.com/OrcaWorkflows/orca/issues">Request Feature</a>
  </p>
</div>


<!-- ABOUT THE OPERATORS REPOSITORY -->
### About The Operators Repository

Orca Operators repository is source of go-to operator component which is responsible for the main data operations
triggered by the Orca Service through Argo Workflows.


<!-- BUILDING DOCKER IMAGE -->
### Building Docker Image
1. Build orca operators image.
```sh
  docker build -t orca/orca-operators:latest operators/Dockerfile
```
2. Push the image to your Docker Registry.
```sh
  docker push -t orca/orca-operators:latest operators/Dockerfile
```

<!-- DEPLOYING DOCKER IMAGE -->
### Deploying Docker Image
Deployment will be executed automatically when you define your Docker registry to the Kubernetes cluster.

Please refer to [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

### Configuration through Environment Variables
##### Orca Operator General Configs
| Variable        | Default | Detail                            | Type   |
|-----------------|---------|-----------------------------------|--------|
| OPERATOR_SOURCE |         | Source operator to be data pulled | String |
| OPERATOR_TARGET |         | Target operator to be data pushed | String |
#### AWS Configs
##### AWS S3 Operator Configs
| Variable           | Default | Detail              | Type   |
|--------------------|---------|---------------------|--------|
| AWS_S3_BUCKET_NAME |         | Bucket name         | String |
| AWS_S3_FILE_PATH   |         | File path           | String |
| AWS_S3_FILE_TYPE   |         | File Type (CSV,TXT) | String |
##### AWS EMR Operator Configs
| Variable                     | Default      | Detail                                            | Type    |
|------------------------------|--------------|---------------------------------------------------|---------|
| AWS_EMR_STEP_SCRIPT_URI      |              | Script S3 URI path                                | String  |
| AWS_EMR_STEP_INPUT_URI       |              | Input file S3 URI path                            | String  |
| AWS_EMR_MASTER_INSTANCE_TYPE | m5.xlarge    | EC2 instance type for master                      | String  |
| AWS_EMR_SLAVE_INSTANCE_TYPE  | m5.xlarge    | EC2 instance type for slave                       | String  |
| AWS_EMR_INSTANCE_COUNT       | 3            | Number of instances including master              | Integer |
| AWS_EMR_CLUSTER_NAME         | Orca Cluster | Name of the cluster                               | String  |
| AWS_EMR_APPLICATIONS         | Spark        | Application                                       | String  |
| AWS_EMR_KEEP_ALIVE           | False        | Termination state of the cluster after completion | Boolean |
##### AWS DynamoDB Operator Configs
| Variable                  | Default     | Detail                                    | Type   |
|---------------------------|-------------|-------------------------------------------|--------|
| AWS_DYNAMODB_TABLE_NAME   | None        | DynamoDB Table Name                       | String |
| AWS_DYNAMODB_BATCH_SIZE   | 1000        | Batch size in integer for write operation | String |
##### AWS Kinesis Operator Configs
| Variable                  | Default     | Detail               | Type   |
|---------------------------|-------------|----------------------|--------|
| AWS_KINESIS_STREAM_NAME   | None        | Kinesis stream name  | String |
#### SQL Configs
| Variable                  | Default     | Detail                       | Type   |
|---------------------------|-------------|------------------------------|--------|
| SQL_HOST                  | None        | Host of the sql server.      | String |
| SQL_PORT                  | None        | Port of the sql server.      | String |
| SQL_USERNAME              | None        | Username of the sql server.  | String |
| SQL_PASSWORD              | None        | Password of the user.        | String |
| SQL_DATABASE              | None        | Database name.               | String |
| SQL_TEXT                  | None        | SQL Statement as text.       | String |
| SQL_TABLENAME             | None        | Aimed table name.            | String |
#### Kafka Operator Configs
| Variable          | Default | Detail                     | Type   |
|-------------------|---------|----------------------------|--------|
| BOOTSTRAP_SERVERS |         | Kafka bootstrap server URL | String |
| KAFKA_TOPIC       |         | Kafka topic URL            | String |
#### Elasticsearch Operator Configs
| Variable                   | Default                      | Detail                                          | Type    |
|----------------------------|------------------------------|-------------------------------------------------|---------|
| ELASTICSEARCH_HOST         |                              | Elasticsearch host URL (Starts with http/https) | String  |
| ELASTICSEARCH_INDEX        |                              | Elasticsearch index name                        | String  |
| ELASTICSEARCH_QUERY        | {"query": {"match_all": {}}} | Elasticsearch query                             | String  |
| ELASTICSEARCH_SEARCH_LIMIT | 1000                         | Elasticsearch single search limit               | Integer |
| ELASTICSEARCH_SCROLL       | 2m                           | Elasticsearch scroll timeout                    | String  |
| ELASTICSEARCH_BULK_LIMIT   | 1000                         | Elasticsearch bulk index limit                  | Integer |
| ELASTICSEARCH_TIMEOUT      | 200                          | Elasticsearch timeout                           | Integer |         | String |
#### Google Cloud Platform Configs
| Variable          | Default | Detail                           | Type   |
|-------------------|---------|----------------------------------|--------|
| GOOGLE_PROJECT_ID |         | Google Cloud Platform Project ID | String |
##### Google PubSub Operator Configs
| Variable                   | Default | Detail                                                                                                                                                                                                                                   | Type    |
|----------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| GOOGLE_PUBSUB_PROJECT_ID          |         | Google Cloud Platform Project ID | String |
| GOOGLE_PUBSUB_TOPIC        |         | Topic name                                                                                                                                                                                                                               | String  |
| GOOGLE_PUBSUB_TOPIC_ACTION | delete  | Delete operation choice. If other than delete, It will not delete topic and subscription.                                                                                                                                                | String  |
| GOOGLE_PUBSUB_TIMEOUT      | 30      | Subscriber timeout interval. If data will not pulled in this interval, Operator stops. (Second)                                                                                                                                          | Integer |
| GOOGLE_PUBSUB_BATCH_SIZE   | 1000    | Publisher batch size in single publish request. It will configure flow-control too. (Max: 1000)                                                                                                                                          | Integer |
| GOOGLE_PUBSUB_MAX_LATENCY  | 1       | The maximum number of seconds to wait for additional messages before automatically publishing the batch.                                                                                                                                 | Float   |
| GOOGLE_PUBSUB_MAX_BYTES    | 524288  | The maximum total size of the messages to collect before automatically publishing the batch, including any byte size overhead of the publish request itself. <br>The maximum value is bound by the server-side limit of 10_000_000 bytes. | Integer |
##### Google BigQuery Operator Configs
| Variable                   | Default | Detail      | Type   |
|----------------------------|---------|-------------|--------|
| GOOGLE_BIGQUERY_PROJECT_ID           |         | Google Cloud Platform Project ID | String |
| GOOGLE_BIGQUERY_DATASET_ID |         | Data Set ID | String |
| GOOGLE_BIGQUERY_TABLE_ID   |         | Table ID    | String |
| GOOGLE_BIGQUERY_QUERY      |         | SQL Query   | String |
#### MongoDB Operator Configs
| Variable                | Default | Detail                   | Type    |
|-------------------------|---------|--------------------------|---------|
| MONGODB_HOST            |         | MongoDB Server Host      | String  |
| MONGODB_PORT            | 27017   | MongoDB Server Port      | Integer |
| MONGODB_DATABASE_NAME   |         | MongoDB Database Name    | String  |
| MONGODB_COLLECTION_NAME |         | MongoDB Collection Name  | String  |
#### Redis Operator Configs
| Variable                | Default | Detail               | Type    |
|-------------------------|---------|----------------------|---------|
| REDIS_HOST            |         | Redis Server Host      | String  |
| REDIS_PORT            | 6379    | Redis Server Port      | Integer |
| REDIS_DATABASE        | 0       | Redis Database Name    | Integer |
| REDIS_PASSWORD        | Null    | Redis Server Password  | String  |
#### Snowflake Operator Configs
| Variable                | Default | Detail                    | Type    |
|-------------------------|---------|---------------------------|---------|
| SNOWFLAKE_DATABASE      |         | Snowflake Database        | String  |
| SNOWFLAKE_SCHEMA        |         | Snowflake Database Schema | String  |
| SNOWFLAKE_TABLE_NAME    |         | Snowflake Table Name      | String  |
| SNOWFLAKE_STATEMENT     |         | Snowflake SQL Statement   | String  |