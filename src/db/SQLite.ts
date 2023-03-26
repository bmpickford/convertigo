import sqlite3 from "sqlite3";
import { isSearchEvent } from "../types.js";
import { DAO, EventWithTimestampAndID } from "./DAO.js";

export class SQLiteAdapter implements DAO {
  private db: sqlite3.Database;

  constructor(filename: string) {
    this.db = new sqlite3.Database(filename);
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS events (
          user TEXT,
          type TEXT,
          item_id TEXT,
          query TEXT,
          timestamp INTEGER,
          id TEXT,
          PRIMARY KEY (timestamp, id)
        )
      `);
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
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        "INSERT INTO events (user, type, item_id, query, timestamp, id) VALUES (?, ?, ?, ?, ?, ?)",
        [user, type, item_id, query, timestamp, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public close(): void {
    this.db.close();
  }
}
