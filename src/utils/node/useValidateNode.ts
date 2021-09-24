import { useEffect, useState } from "react";

import { BigQueryValidationSchema } from "components/FormManager/BigQuery";
import { DynamoDBValidationSchema } from "components/FormManager/DynamoDB";
import { ElasticSearchValidationSchema } from "components/FormManager/ElasticSearch";
import { EMRValidationSchema } from "components/FormManager/EMR";
import { KafkaValidationSchema } from "components/FormManager/Kafka";
import { KinesisValidationSchema } from "components/FormManager/Kinesis";
import { MongoDBValidationSchema } from "components/FormManager/MongoDB";
import { PubSubValidationSchema } from "components/FormManager/PubSub";
import { RedisValidationSchema } from "components/FormManager/Redis";
import { S3ValidationSchema } from "components/FormManager/S3";

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
