import { init } from "./app";
import { DynamoDBDAO, JSONLDAO } from "./db";
import { config } from "dotenv";
import { DAO } from "./db/DAO";

config()

const use_dynamo = process.env.OUTPUT === 'dynamodb';
const dynamo_table_name = process.env.DYNAMO_TABLE_NAME;
const dynamo_region = process.env.DYNAMO_REGION;

let db: DAO = new JSONLDAO();

if (use_dynamo) {
  if (!dynamo_table_name) {
  throw new Error("DynamoDB table name must be provided");
  }
  
  if (!dynamo_region) {
    throw new Error("DynamoDB region must be provided");
  }

  db = new DynamoDBDAO(dynamo_table_name, dynamo_region);
}

const port = process.env.PORT || 9000;
const app = init(db);

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

process.on("SIGTERM", () => {
  console.log("Received SIGTERM signal, closing server...");
  server.close(() => process.exit(0));
});

server.on("close", () => db.close());
