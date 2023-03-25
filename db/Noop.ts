import { DAO } from "./DAO";

export class Noop implements DAO {
  async save(event: any): Promise<void> {
    return;
  }

  close(): void {
    return;
  }
}
