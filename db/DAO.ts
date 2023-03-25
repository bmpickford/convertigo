import { AnyEvent } from "../types";

export type EventWithTimestampAndID = AnyEvent & {
  timestamp: number;
  id: string;
};

export interface DAO {
  save(event: EventWithTimestampAndID): Promise<void>;
  close(): void;
}
