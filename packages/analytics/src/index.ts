import { init } from "./app.js";
import { ClickhouseAdapter } from "./db/index.js";
import { config } from "dotenv";
import { DAO } from "./db/dao.js";

config();

const abortController = new AbortController();
const db: DAO = new ClickhouseAdapter(
  process.env.CLICKHOUSE_HOST,
  process.env.CLICKHOUSE_PORT,
);

const port = process.env.PORT || 9000;
const app = init(db);

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

process.on("SIGTERM", () => {
  abortController.abort();
  console.log("Received SIGTERM signal, closing server...");
  server.close(() => process.exit(0));
});

server.on("close", () => db.close());
