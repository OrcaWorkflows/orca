import { Table } from "react-bootstrap";
import Collapsible from "react-collapsible";

import NodeRow from "./rowgenerator";
import "./scss/nodes.scss";
import "./scss/dnd.css";

const sidebar = () => {
	return (
		<div className="sidebar">
			<div className="sidebar-scroll">
				<Table className={"sidebar-table"}>
					<tbody>
						<tr>
							<td>
								<Collapsible trigger="Amazon Web Service" open={true}>
									<Table className={"sidebar-table"}>
										<tbody>
											<NodeRow node={"S3"} />
											<NodeRow node={"DynamoDB"} />
											<NodeRow node={"Kinesis"} />
											<NodeRow node={"Lambda"} />
											<NodeRow node={"EMR"} />
											<NodeRow node={"RedShift"} />
											<NodeRow node={"SQS"} />
										</tbody>
									</Table>
								</Collapsible>
							</td>
						</tr>
						<tr>
							<td>
								<Collapsible trigger="Google Cloud Platform" open={true}>
									<Table className={"sidebar-table"}>
										<tbody>
											<NodeRow node={"PubSub"} />
											<NodeRow node={"BigQuery"} />
											<NodeRow node={"DataFlow"} />
											<NodeRow node={"DataProc"} />
											<NodeRow node={"AppEngine"} />
											<NodeRow node={"CloudFunctions"} />
											<NodeRow node={"BigTable"} />
											<NodeRow node={"FileStore"} />
											<NodeRow node={"CloudSQL"} />
											<NodeRow node={"MemoryStore"} />
										</tbody>
									</Table>
								</Collapsible>
							</td>
						</tr>
						<tr>
							<td>
								<Collapsible trigger={"Apache Stack"} open={true}>
									<Table className={"sidebar-table"}>
										<tbody>
											<NodeRow node={"Kafka"} />
											<NodeRow node={"Spark"} />
											<NodeRow node={"Flink"} />
											<NodeRow node={"Pig"} />
											<NodeRow node={"Hive"} />
											<NodeRow node={"Hadoop"} />
											<NodeRow node={"Impala"} />
											<NodeRow node={"Cassandra"} />
										</tbody>
									</Table>
								</Collapsible>
							</td>
						</tr>
						<tr>
							<td>
								<Collapsible trigger={"Elastic Stack"} open={true}>
									<Table className={"sidebar-table"}>
										<tbody>
											<NodeRow node={"Elasticsearch"} />
										</tbody>
									</Table>
								</Collapsible>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	);
};
export default sidebar;
