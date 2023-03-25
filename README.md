# convertigo

> nodejs ecommerce event ingestor

## Event types

All events require these params:

```json
{
  "type": "search | view | add_to_cart | conversion",
  "user": "UNIQUE_USER_IDENTIFIER"
}
```

| Event       | Description                           | Additional params     |
| ----------- | ------------------------------------- | --------------------- |
| search      | Send when a user searches             | `{ query: string }`   |
| view        | Send when a user sees a resource      | `{ item_id: string }` |
| add_to_cart | Send when a user adds to cart         | `{ item_id: string }` |
| conversion  | Send when a user completes a checkout | `{ item_id: string }` |

## Data persistence

By default it will output to sqlite, but a dynamodb adapter is also available. You can setting this environment variable `OUTPUT=dynamodb`. To create your own, extend the interface in `db/DAO.ts` and initialise it in `index.ts`

### Using DynamoDB

To use dynamo you will need to set the table name and region in the environment variables. See `.env.example` for a reference.

The persisted structure for the dynamo entry uses single table design, and looks like this:

```json
{
  "pk": { "S": "type#EVENT_TYPE" },
  "sk": { "S": "user#USER_ID#event#EVENT_ID" },
  "eventType": { "S": "EVENT_TYPE" },
  "eventData": { "S": "EVENT_JSON_BLOB" },
  "createdAt": { "N": "UTC_MS_TIME" }
}
```

## TODO

- Batch event input
- Dashboard
- File upload?
