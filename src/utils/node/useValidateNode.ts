import { useEffect, useState } from "react";

import { BigQueryValidationSchema } from "components/FormManager/BigQuery";
import { DynamoDBValidationSchema } from "components/FormManager/DynamoDB";
import { ElasticSearchValidationSchema } from "components/FormManager/ElasticSearch";
import { EMRValidationSchema } from "components/FormManager/EMR";
import { KafkaValidationSchema } from "components/FormManager/Kafka";
import { KinesisValidationSchema } from "components/FormManager/Kinesis";
import { LambdaValidationSchema } from "components/FormManager/Lambda";
import { MongoDBValidationSchema } from "components/FormManager/MongoDB";
import { PubSubValidationSchema } from "components/FormManager/PubSub";
import { RedisValidationSchema } from "components/FormManager/Redis";
import { S3ValidationSchema } from "components/FormManager/S3";
import { SQLValidationSchema } from "components/FormManager/SQL";

const useValidateNode = (
	type: string,
	data: Record<string, unknown>
): [string[]] => {
	const [nodeValidationErrors, setNodeValidationErrors] = useState([]);

	useEffect(() => {
		let isMounted = true;
		setNodeValidationErrors([]);
		let schema:
			| typeof BigQueryValidationSchema
			| typeof DynamoDBValidationSchema
			| typeof ElasticSearchValidationSchema
			| typeof EMRValidationSchema
			| typeof KafkaValidationSchema
			| typeof KinesisValidationSchema
			| typeof LambdaValidationSchema
			| typeof MongoDBValidationSchema
			| typeof PubSubValidationSchema
			| typeof RedisValidationSchema
			| typeof S3ValidationSchema
			| typeof SQLValidationSchema
			| undefined;

		if (type === "bigquery") schema = BigQueryValidationSchema;
		if (type === "dynamodb") schema = DynamoDBValidationSchema;
		if (type === "elasticsearch") schema = ElasticSearchValidationSchema;
		if (type === "emr") schema = EMRValidationSchema;
		if (type === "kafka") schema = KafkaValidationSchema;
		if (type === "kinesis") schema = KinesisValidationSchema;
		if (type === "lambda") schema = LambdaValidationSchema;
		if (type === "mongodb") schema = MongoDBValidationSchema;
		if (type === "pubsub") schema = PubSubValidationSchema;
		if (type === "redis") schema = RedisValidationSchema;
		if (type === "s3") schema = S3ValidationSchema;
		if (
			type === "mariadb" ||
			type === "mssql" ||
			type === "mysql" ||
			type === "oracle" ||
			type === "postgresql"
		)
			schema = SQLValidationSchema;

		schema?.validate(data).catch((err) => {
			if (isMounted) setNodeValidationErrors(err.errors);
		});
		return () => {
			isMounted = false;
		};
	}, [data, setNodeValidationErrors]);

	return [nodeValidationErrors];
};

export default useValidateNode;
