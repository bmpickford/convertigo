import { ClickHouseClient, createClient } from "@clickhouse/client";
import { isSearchEvent } from "../types.js";
import { DAO, EventTable, EventWithTimestampAndID } from "./dao.js";

const TEMP_PROJECT_ID = "9043636f-e875-413a-bf9d-58f6251b71f8";

export class ClickhouseAdapter implements DAO {
  private client: ClickHouseClient;

  constructor(
    host?: string,
    port?: string,
    private abortController = new AbortController()
  ) {
    this.client = createClient({
      host: host && port ? `http://${host}:${port}` : undefined,
    });

    this.client.exec({
      query: `
        CREATE TABLE IF NOT EXISTS events
        (id UUID, type String, item_id String, query String, timestamp UInt64, user String, project_id UUID)
        ENGINE MergeTree()
        ORDER BY (id)
      `,
    });
  }

  public async getSearches(): Promise<EventTable[]> {
    const response = await this.client.query({
      query: `
        SELECT *
        FROM events
        WHERE type = 'search' 
        LIMIT 100
      `,
      format: "JSONEachRow",
      abort_signal: this.abortController.signal,
    });
    return response.json<EventTable[]>();
  }

  public async getSearchesDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<EventTable[]> {
    const response = await this.client.query({
      query: `
        SELECT *
        FROM events
        WHERE type = 'search' 
        AND ({ start_date: UInt64 }) < timestamp
        AND ({ end_date: UInt64 }) > timestamp
        LIMIT 100
      `,
      format: "JSONEachRow",
      abort_signal: this.abortController.signal,
      query_params: {
        start_date: startDate.getTime(),
        end_date: endDate.getTime(),
      },
    });
    return response.json<EventTable[]>();
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
      values: [[id, type, item_id, query, timestamp, user, TEMP_PROJECT_ID]],
    });
  }

  public close(): void {
    this.client.close();
  }
}
