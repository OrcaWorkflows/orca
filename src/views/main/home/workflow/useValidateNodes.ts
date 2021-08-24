import { useEffect, useState } from "react";

import { Elements } from "react-flow-renderer";

import { BigQueryValidationSchema } from "views/main/home/nodeForms/BigQuery";
import { ElasticSearchValidationSchema } from "views/main/home/nodeForms/ElasticSearch";
import { EMRValidationSchema } from "views/main/home/nodeForms/EMR";
import { KafkaValidationSchema } from "views/main/home/nodeForms/Kafka";
import { PubSubValidationSchema } from "views/main/home/nodeForms/PubSub";
import { S3ValidationSchema } from "views/main/home/nodeForms/S3";

const validateOptions = { abortEarly: false }; // Override abortEarly which defaults to true

const useValidateNodes = (
	nodes: Elements
): [
	{
		[k: string]: string[];
	}
] => {
	const [nodeValidationErrors, setNodeValidationErrors] = useState<{
		[k: string]: string[];
	}>({});

	useEffect(() => {
		setNodeValidationErrors({});
		if (nodes.length) {
			for (const node of nodes) {
				if (node.type) {
					let schema:
						| typeof BigQueryValidationSchema
						| typeof ElasticSearchValidationSchema
						| typeof EMRValidationSchema
						| typeof KafkaValidationSchema
						| typeof PubSubValidationSchema
						| typeof S3ValidationSchema
						| undefined;
					if (node.type === "BigQuery") schema = BigQueryValidationSchema;
					if (node.type === "ElasticSearch")
						schema = ElasticSearchValidationSchema;
					if (node.type === "EMR") schema = EMRValidationSchema;
					if (node.type === "Kafka") schema = KafkaValidationSchema;
					if (node.type === "PubSub") schema = PubSubValidationSchema;
					if (node.type === "S3") schema = S3ValidationSchema;

					schema?.validate(node.data, validateOptions).catch((err) =>
						setNodeValidationErrors((prevNodeValidationErrors) => {
							if (typeof prevNodeValidationErrors === "object")
								return {
									...prevNodeValidationErrors,
									[node.id]: [...err.errors],
								};
							else return { [node.id]: [...err.errors] };
						})
					);
				}
			}
		}
	}, [nodes, setNodeValidationErrors]);

	return [nodeValidationErrors];
};

export default useValidateNodes;
