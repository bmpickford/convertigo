import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { EventWithTimestampAndID, DAO } from "./DAO";

export class DynamoDBDAO implements DAO {
  private readonly tableName: string;
  private readonly dynamoClient: DynamoDBClient;

  constructor(tableName: string, region: string) {
    this.tableName = tableName;
    this.dynamoClient = new DynamoDBClient({ region });
  }

  async save(event: EventWithTimestampAndID): Promise<void> {
    const item = {
      pk: { S: `type#${event.type}` },
      sk: { S: `user#${event.user}#event#${event.id}` },
      eventType: { S: event.type },
      eventData: { S: JSON.stringify(event) },
      createdAt: { N: event.timestamp.toString() },
    };
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    const command = new PutItemCommand(params);
    await this.dynamoClient.send(command);
  }

  close(): void {
    return;
  }
}
