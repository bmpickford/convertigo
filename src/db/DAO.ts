import { AnyEvent } from "../types.js";

export type EventWithTimestampAndID = AnyEvent & {
  timestamp: number;
  id: string;
};

export interface DAO {
  save(event: EventWithTimestampAndID): Promise<void>;
  close(): void;
}
