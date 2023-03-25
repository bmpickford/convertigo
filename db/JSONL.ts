import fs from "fs";
import { DAO, EventWithTimestampAndID } from "./DAO";

export class JSONLDAO implements DAO {
  private writeStream: fs.WriteStream;

  constructor(filename = new Date().toISOString() + ".jsonl") {
    this.writeStream = fs.createWriteStream(filename);
    this.writeStream.on("finish", () => {
      console.log(`JSONL data has been written to ${filename}.`);
    });

    this.writeStream.on("error", (error) => {
      console.error(`Error writing JSONL data to ${filename}: ${error}`);
    });
  }
  async save(event: EventWithTimestampAndID): Promise<void> {
    const jsonString = JSON.stringify({
      ...event,
      timestamp: new Date().getTime(),
    });
    this.writeStream.write(jsonString + "\n");
  }

  close(): void {
    this.writeStream.end();
  }
}
