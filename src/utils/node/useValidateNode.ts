import { useEffect, useState } from "react";

import { BigQueryValidationSchema } from "views/main/Home/nodeForms/BigQuery";
import { DynamoDBValidationSchema } from "views/main/Home/nodeForms/DynamoDB";
import { ElasticSearchValidationSchema } from "views/main/Home/nodeForms/ElasticSearch";
import { EMRValidationSchema } from "views/main/Home/nodeForms/EMR";
import { KafkaValidationSchema } from "views/main/Home/nodeForms/Kafka";
import { KinesisValidationSchema } from "views/main/Home/nodeForms/Kinesis";
import { MongoDBValidationSchema } from "views/main/Home/nodeForms/MongoDB";
import { PubSubValidationSchema } from "views/main/Home/nodeForms/PubSub";
import { RedisValidationSchema } from "views/main/Home/nodeForms/Redis";
import { S3ValidationSchema } from "views/main/Home/nodeForms/S3";

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
			| typeof MongoDBValidationSchema
			| typeof PubSubValidationSchema
			| typeof RedisValidationSchema
			| typeof S3ValidationSchema
			| undefined;

		if (type === "BigQuery") schema = BigQueryValidationSchema;
		if (type === "DynamoDB") schema = DynamoDBValidationSchema;
		if (type === "ElasticSearch") schema = ElasticSearchValidationSchema;
		if (type === "EMR") schema = EMRValidationSchema;
		if (type === "Kafka") schema = KafkaValidationSchema;
		if (type === "Kinesis") schema = KinesisValidationSchema;
		if (type === "MongoDB") schema = MongoDBValidationSchema;
		if (type === "PubSub") schema = PubSubValidationSchema;
		if (type === "Redis") schema = RedisValidationSchema;
		if (type === "S3") schema = S3ValidationSchema;

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
