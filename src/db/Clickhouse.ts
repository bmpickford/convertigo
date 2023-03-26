import { ClickHouseClient, createClient } from "@clickhouse/client";
import { isSearchEvent } from "../types.js";
import { DAO, EventWithTimestampAndID } from "./DAO.js";

export class ClickhouseAdapter implements DAO {
  private client: ClickHouseClient;

  constructor(host?: string, port?: string) {
    this.client = createClient({
      host: host && port ? `http://${host}:${port}` : undefined,
    });

    this.client.exec({
      query: `
        CREATE TABLE IF NOT EXISTS events
        (id String, type String, item_id String, query String, timestamp UInt64, user String)
        ENGINE MergeTree()
        ORDER BY (id)
      `,
    });
  }

  public async save(event: EventWithTimestampAndID): Promise<void> {
    let item_id: string | null = null;
    let query: string | null = null;
    const { user, type, timestamp, id } = event;

    if (isSearchEvent(event)) {
      query = event.query;
    } else {
      item_id = event.item_id;
    }
    await this.client.insert({
      table: "events",
      values: [[id, type, item_id, query, timestamp, user]],
    });
  }

  public close(): void {
    this.client.close();
  }
}
