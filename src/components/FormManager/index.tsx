import BigQuery, {
	BigQueryValidationSchema,
} from "components/FormManager/BigQuery";
import DynamoDB, {
	DynamoDBValidationSchema,
} from "components/FormManager/DynamoDB";
import ElasticSearch, {
	ElasticSearchValidationSchema,
} from "components/FormManager/ElasticSearch";
import EMR, { EMRValidationSchema } from "components/FormManager/EMR";
import Kafka, { KafkaValidationSchema } from "components/FormManager/Kafka";
import Kinesis, {
	KinesisValidationSchema,
} from "components/FormManager/Kinesis";
import MongoDB, {
	MongoDBValidationSchema,
} from "components/FormManager/MongoDB";
import PubSub, { PubSubValidationSchema } from "components/FormManager/PubSub";
import Redis, { RedisValidationSchema } from "components/FormManager/Redis";
import S3, { S3ValidationSchema } from "components/FormManager/S3";
import SQL, { SQLValidationSchema } from "components/FormManager/SQL";

const FormManager = (
	nodeType: string
): {
	Form: any;
	validationSchema: any;
} => {
	let Form;
	let validationSchema;

	switch (nodeType) {
		case "bigquery":
			Form = BigQuery;
			validationSchema = BigQueryValidationSchema;
			break;
		case "dynamodb":
			Form = DynamoDB;
			validationSchema = DynamoDBValidationSchema;
			break;
		case "elasticsearch":
			Form = ElasticSearch;
			validationSchema = ElasticSearchValidationSchema;
			break;
		case "emr":
			Form = EMR;
			validationSchema = EMRValidationSchema;
			break;
		case "kafka":
			Form = Kafka;
			validationSchema = KafkaValidationSchema;
			break;
		case "kinesis":
			Form = Kinesis;
			validationSchema = KinesisValidationSchema;
			break;
		case "mongodb":
			Form = MongoDB;
			validationSchema = MongoDBValidationSchema;
			break;
		case "pubsub":
			Form = PubSub;
			validationSchema = PubSubValidationSchema;
			break;
		case "redis":
			Form = Redis;
			validationSchema = RedisValidationSchema;
			break;
		case "s3":
			Form = S3;
			validationSchema = S3ValidationSchema;
			break;
		case "postgresql":
		case "mysql":
		case "mariadb":
		case "oracle":
		case "mssql":
			Form = SQL;
			validationSchema = SQLValidationSchema;
			break;
		default:
			return {
				Form: function Form() {
					return null;
				},
				validationSchema,
			};
	}

	return {
		Form,
		validationSchema,
	};
};

export default FormManager;
