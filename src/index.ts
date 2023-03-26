import { init } from "./app.js";
import { ClickhouseAdapter, JSONLAdapter } from "./db/index.js";
import { config } from "dotenv";
import { DAO } from "./db/DAO.js";

config();

const getDataSource = (): DAO => {
  switch (process.env.OUTPUT) {
    case "convertigo":
      console.log("Using Convertigo as output");
      return new ClickhouseAdapter(
        process.env.CLICKHOUSE_HOST,
        process.env.CLICKHOUSE_PORT
      );
    default:
      console.log("Using JSONL as output");
      return new JSONLAdapter();
  }
};

const db: DAO = getDataSource();

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
