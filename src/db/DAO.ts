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
  getSearches(): Promise<EventTable[]>;
  getSearchesDateRange(startDate: Date, endDate: Date): Promise<EventTable[]>;
}

export class Noop implements DAO {
  getSearchesDateRange(startDate: Date, endDate: Date): Promise<EventTable[]> {
    return Promise.resolve([]);
  }
  getSearches(): Promise<EventTable[]> {
    return Promise.resolve([]);
  }
  async save(event: any): Promise<void> {
    return;
  }

  close(): void {
    return;
  }
}
