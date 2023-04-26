import { AnyEvent } from "../types.js";

export type EventWithTimestampAndID = AnyEvent & {
  timestamp: number;
  id: string;
};

export interface EventTable {
  id: string;
  type: string;
  item_id: string;
  query: string;
  timestamp: number;
  user: string;
  project_id: string;
}

export interface DAO {
  save(event: EventWithTimestampAndID): Promise<void>;
  close(): void;
}

export class Noop implements DAO {
  async save(event: any): Promise<void> {
    return;
  }

  close(): void {
    return;
  }
}
