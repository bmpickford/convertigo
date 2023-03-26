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

By default it will output to a jsonl file, but a clickhouse adapter is also available. You can setting this environment variable `OUTPUT=clickhouse`. To create your own, extend the interface in `db/DAO.ts` and initialise it in `index.ts`

## TODO

- Batch event input
- Dashboard
- File upload?
