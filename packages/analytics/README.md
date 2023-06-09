# convertigo

> nodejs ecommerce event ingestor

## Running

### Docker

This will run the app and a clickhouse server for event ingestion

```bash
docker-compose up --build -d
```

### Development

If you are running it without docker, you will need to set CLICKHOUSE_HOST and CLICKHOUSE_PORT as environment variables

```bash
npm run dev
```

## Usage

#### Search example

```bash
curl -X POST --header "Content-Type: application/json" 0.0.0.0:9000/event -d '{"type": "search", "user": "123456", "query": "hello, world!"}'
```

#### Conversion example

```bash
curl -X POST --header "Content-Type: application/json" 0.0.0.0:9000/event -d '{"type": "conversion", "user": "123456", "item_id": "1"}'
```

See below for more details on other events

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

Data is stored in clickhouse. To create your own adapter, extend the interface in `db/dao.ts` and initialise it in `index.ts`

## TODO

- Batch event input
- Accept array of ids for view
- Expand DAO
  - include getting counts of each type per day and/or month
  - include getting top searches
  - include getting top converting item_ids
- Dashboard
- File upload?
