--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3 (Debian 13.3-1.pgdg100+1)
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: argo_workflow; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.argo_workflow (
    id integer NOT NULL,
    workflow_id integer,
    argo_name character varying NOT NULL,
    date timestamp without time zone
);


--
-- Name: argo_workflow_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.argo_workflow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: argo_workflow_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.argo_workflow_id_seq OWNED BY test.argo_workflow.id;


--
-- Name: workflow; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.workflow (
    id integer NOT NULL,
    property jsonb NOT NULL,
    user_id integer NOT NULL,
    updated_at date,
    created_at date,
    name character varying,
    submitted boolean DEFAULT false
);


--
-- Name: canvas_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.canvas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canvas_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.canvas_id_seq OWNED BY test.workflow.id;


--
-- Name: hibernate_sequence; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: host; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.host (
    id integer NOT NULL,
    host character varying,
    system_config_id integer
);


--
-- Name: hosts_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.hosts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hosts_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.hosts_id_seq OWNED BY test.host.id;


--
-- Name: operator; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.operator (
    id integer NOT NULL,
    name character varying NOT NULL,
    category_id integer NOT NULL,
    label character varying
);


--
-- Name: operator_category; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.operator_category (
    id integer NOT NULL,
    category character varying
);


--
-- Name: operator_category_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.operator_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: operator_category_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.operator_category_id_seq OWNED BY test.operator_category.id;


--
-- Name: operator_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.operator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: operator_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.operator_id_seq OWNED BY test.operator.id;


--
-- Name: required_operator_variables; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.required_operator_variables (
    id integer NOT NULL,
    name character varying NOT NULL,
    "default" character varying DEFAULT 'None'::character varying,
    operator_id integer NOT NULL
);


--
-- Name: COLUMN required_operator_variables."default"; Type: COMMENT; Schema: test; Owner: postgres
--

COMMENT ON COLUMN test.required_operator_variables."default" IS 'None';


--
-- Name: required_operator_variables_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.required_operator_variables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: required_operator_variables_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.required_operator_variables_id_seq OWNED BY test.required_operator_variables.id;


--
-- Name: schedule; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.schedule (
    id integer NOT NULL,
    workflow_id integer,
    cron_expression character varying NOT NULL,
    suspended boolean DEFAULT false,
    timezone character varying NOT NULL,
    starting_deadline_seconds integer DEFAULT 0,
    successful_history_limit integer DEFAULT 3,
    created_at timestamp without time zone,
    argo_cron_workflow_name character varying
);


--
-- Name: schedule_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.schedule_id_seq OWNED BY test.schedule.id;


--
-- Name: system_config; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.system_config (
    id integer NOT NULL,
    name character varying NOT NULL,
    username character varying,
    password character varying,
    property jsonb,
    operator_id integer,
    updated_at timestamp without time zone,
    created_at timestamp without time zone,
    user_id integer
);


--
-- Name: system_config_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.system_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_config_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.system_config_id_seq OWNED BY test.system_config.id;


--
-- Name: user; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    organization_name character varying,
    password character varying,
    updated_at date,
    created_at date
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

CREATE SEQUENCE test.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: test; Owner: postgres
--

ALTER SEQUENCE test.users_id_seq OWNED BY test."user".id;


--
-- Name: argo_workflow id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.argo_workflow ALTER COLUMN id SET DEFAULT nextval('test.argo_workflow_id_seq'::regclass);


--
-- Name: host id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.host ALTER COLUMN id SET DEFAULT nextval('test.hosts_id_seq'::regclass);


--
-- Name: operator id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.operator ALTER COLUMN id SET DEFAULT nextval('test.operator_id_seq'::regclass);


--
-- Name: operator_category id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.operator_category ALTER COLUMN id SET DEFAULT nextval('test.operator_category_id_seq'::regclass);


--
-- Name: required_operator_variables id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.required_operator_variables ALTER COLUMN id SET DEFAULT nextval('test.required_operator_variables_id_seq'::regclass);


--
-- Name: schedule id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.schedule ALTER COLUMN id SET DEFAULT nextval('test.schedule_id_seq'::regclass);


--
-- Name: system_config id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.system_config ALTER COLUMN id SET DEFAULT nextval('test.system_config_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test."user" ALTER COLUMN id SET DEFAULT nextval('test.users_id_seq'::regclass);


--
-- Name: workflow id; Type: DEFAULT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.workflow ALTER COLUMN id SET DEFAULT nextval('test.canvas_id_seq'::regclass);


--
-- Data for Name: operator; Type: TABLE DATA; Schema: test; Owner: postgres
--

INSERT INTO test.operator (id, name, category_id, label)
VALUES (10,	'dataflow',	2,	'Dataflow'),
(11,	'spark',	3,	'Spark'),
(5,	'emr',	1,	'EMR'),
(14,	'elasticsearch',	4,	'Elasticsearch'),
(4,	'lambda',	1,	'Lambda'),
(2,	'dynamodb',	1,	'DynamoDB'),
(8,	'bigtable',	2,	'BigTable'),
(1,	's3',	1,	'S3'),
(6,	'pubsub',	2,	'PubSub'),
(12,	'kafka',	3,	'Kafka'),
(13,'cassandra',	3,	'Cassandra'),
(9,	'cloudsql',	2,	'CloudSQL'),
(7,	'bigquery',	2,	'BigQuery'),
(3,	'kinesis',	1,	'Kinesis'),
(15,	'mongodb',	5,	'MongoDB'),
(16, 'redis',	6,	'Redis'),
(17,	'postgresql',	7,	'PostgreSQL'),
(18,	'mysql',	7,	'MySQL'),
(19,	'mariadb',	7,	'MariaDB'),
(20,	'oracle',	7,	'Oracle'),
(21,	'mssql',	7,	'MSSQL'),
(22,	'snowflake',	8,	'Snowflake');


--
-- Data for Name: operator_category; Type: TABLE DATA; Schema: test; Owner: postgres
--

INSERT INTO test.operator_category (id, category)
VALUES (1,	'AWS'),
(2,	'GCP'),
(3,	'ApacheStack'),
(4,	'Elastic'),
(5,	'MongoDB'),
(6,	'Redis'),
(7,	'SQL'),
(8,	'Snowflake');


--
-- Data for Name: required_operator_variables; Type: TABLE DATA; Schema: test; Owner: postgres
--

INSERT INTO test.required_operator_variables (id, name, "default", operator_id)
VALUES (7,	'ELASTICSEARCH_INDEX',	NULL,	14),
(5,	'KAFKA_TOPIC',	NULL,	12),
(2,	'AWS_S3_FILE_PATH',	NULL,	1),
(1,	'AWS_S3_BUCKET_NAME',	NULL,	1),
(3,	'AWS_S3_FILE_TYPE',	NULL,	1),
(9,	'GOOGLE_PUBSUB_TOPIC',	NULL,	6),
(10,	'GOOGLE_PUBSUB_TOPIC_ACTION',	NULL,	6),
(14,	'GOOGLE_BIGQUERY_DATASET_ID',	NULL,	7),
(15,	'GOOGLE_BIGQUERY_TABLE_ID',	NULL,	7),
(16,	'GOOGLE_BIGQUERY_QUERY',	NULL,	7),
(8,	'GOOGLE_PUBSUB_PROJECT_ID',	NULL,	6),
(13,	'GOOGLE_BIGQUERY_PROJECT_ID',	NULL,	7),
(17,	'AWS_EMR_STEP_SCRIPT_URI',	NULL,	5),
(18,	'AWS_EMR_STEP_INPUT_URI',	NULL,	5),
(19,	'AWS_EMR_MASTER_INSTANCE_TYPE',	NULL,	5),
(20,	'AWS_EMR_SLAVE_INSTANCE_TYPE',	NULL,	5),
(21,	'AWS_EMR_INSTANCE_COUNT',	NULL,	5),
(23,	'AWS_DYNAMODB_TABLE_NAME',	NULL,	2),
(24,	'AWS_DYNAMODB_BATCH_SIZE',	'1000',	2),
(25,	'AWS_KINESIS_STREAM_NAME',	NULL,	3),
(28,	'MONGODB_DATABASE_NAME',	NULL,	15),
(29,	'MONGODB_COLLECTION_NAME',	NULL,	15),
(33,	'REDIS_DATABASE',	'0',	16),
(38,	'SQL_DATABASE',	NULL,	17),
(39,	'SQL_TEXT',	NULL,	17),
(40,	'SQL_TABLENAME',	NULL,	17),
(45,	'SQL_DATABASE',	NULL,	18),
(46,	'SQL_TEXT',	NULL,	18),
(47,	'SQL_TABLENAME',	NULL,	18),
(52,	'SQL_DATABASE',	NULL,	19),
(53,	'SQL_TEXT',	NULL,	19),
(54,	'SQL_TABLENAME',	NULL,	19),
(59,	'SQL_DATABASE',	NULL,	20),
(60,	'SQL_TEXT',	NULL,	20),
(61,	'SQL_TABLENAME',	NULL,	20),
(66,	'SQL_DATABASE',	NULL,	21),
(67,	'SQL_TEXT',	NULL,	21),
(68,	'SQL_TABLENAME',	NULL,	21),
(69,	'AWS_LAMBDA_FUNC_NAME',	NULL,	4),
(70,	'AWS_LAMBDA_RUNTIME',	NULL,	4),
(71,	'AWS_LAMBDA_ROLE',	NULL,	4),
(72,	'AWS_LAMBDA_HANDLER',	NULL,	4),
(73,	'AWS_LAMBDA_CODE_S3_BUCKET',	NULL,	4),
(74,	'AWS_LAMBDA_CODE_S3_KEY',	NULL,	4),
(75,	'AWS_LAMBDA_PAYLOAD',	NULL,	4),
(76,	'MONGODB_QUERY',	'{}',	15),
(77,	'ELASTICSEARCH_QUERY',	'{"query": {"match_all": {}}}',	14),
(80,	'SNOWFLAKE_STATEMENT',	NULL,	22),
(81,	'SNOWFLAKE_DATABASE',	NULL,	22),
(82,	'SNOWFLAKE_TABLE_NAME',	NULL,	22),
(83,	'SNOWFLAKE_SCHEMA',	NULL,	22);


--
-- Name: argo_workflow_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.argo_workflow_id_seq', 1, true);


--
-- Name: canvas_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.canvas_id_seq', 1, true);


--
-- Name: hibernate_sequence; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.hibernate_sequence', 1, true);


--
-- Name: hosts_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.hosts_id_seq', 1, true);


--
-- Name: operator_category_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.operator_category_id_seq', 9, true);


--
-- Name: operator_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.operator_id_seq', 23, true);


--
-- Name: required_operator_variables_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.required_operator_variables_id_seq', 52, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.schedule_id_seq', 1, true);


--
-- Name: system_config_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.system_config_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.users_id_seq', 2, true);


--
-- Name: argo_workflow argo_workflow_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.argo_workflow
    ADD CONSTRAINT argo_workflow_pk PRIMARY KEY (id);


--
-- Name: workflow canvas_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.workflow
    ADD CONSTRAINT canvas_pk PRIMARY KEY (id);


--
-- Name: host hosts_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.host
    ADD CONSTRAINT hosts_pk PRIMARY KEY (id);


--
-- Name: operator_category operator_category_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.operator_category
    ADD CONSTRAINT operator_category_pk PRIMARY KEY (id);


--
-- Name: operator operator_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.operator
    ADD CONSTRAINT operator_pk PRIMARY KEY (id);


--
-- Name: required_operator_variables required_operator_variables_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.required_operator_variables
    ADD CONSTRAINT required_operator_variables_pk PRIMARY KEY (id);


--
-- Name: schedule schedule_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.schedule
    ADD CONSTRAINT schedule_pk PRIMARY KEY (id);


--
-- Name: system_config system_config_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.system_config
    ADD CONSTRAINT system_config_pk PRIMARY KEY (id);


--
-- Name: user users_pk; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test."user"
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: user_email_uindex; Type: INDEX; Schema: test; Owner: postgres
--

CREATE UNIQUE INDEX user_email_uindex ON test."user" USING btree (email);


--
-- Name: user_username_uindex; Type: INDEX; Schema: test; Owner: postgres
--

CREATE UNIQUE INDEX user_username_uindex ON test."user" USING btree (username);


--
-- Name: argo_workflow argo_workflow_workflow_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.argo_workflow
    ADD CONSTRAINT argo_workflow_workflow_id_fk FOREIGN KEY (workflow_id) REFERENCES test.workflow(id);


--
-- Name: workflow canvas_user_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.workflow
    ADD CONSTRAINT canvas_user_id_fk FOREIGN KEY (user_id) REFERENCES test."user"(id);


--
-- Name: host hosts_system_config_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.host
    ADD CONSTRAINT hosts_system_config_id_fk FOREIGN KEY (system_config_id) REFERENCES test.system_config(id);


--
-- Name: operator operator_operator_category_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.operator
    ADD CONSTRAINT operator_operator_category_id_fk FOREIGN KEY (category_id) REFERENCES test.operator_category(id);


--
-- Name: required_operator_variables required_operator_variables_operator_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.required_operator_variables
    ADD CONSTRAINT required_operator_variables_operator_id_fk FOREIGN KEY (operator_id) REFERENCES test.operator(id);


--
-- Name: schedule schedule_workflow_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.schedule
    ADD CONSTRAINT schedule_workflow_id_fk FOREIGN KEY (workflow_id) REFERENCES test.workflow(id);


--
-- Name: system_config system_config_operator_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.system_config
    ADD CONSTRAINT system_config_operator_id_fk FOREIGN KEY (operator_id) REFERENCES test.operator(id);


--
-- Name: system_config system_config_user_id_fk; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.system_config
    ADD CONSTRAINT system_config_user_id_fk FOREIGN KEY (user_id) REFERENCES test."user"(id);


--
-- PostgreSQL database dump complete
--

