import { Event } from "../types";

export type EventWithTimestampAndID = Event & { timestamp: number; id: string };

export interface DAO {
  save(event: EventWithTimestampAndID): Promise<void>;
  close(): void;
}
