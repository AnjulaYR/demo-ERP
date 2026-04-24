# PostgreSQL

This folder contains local PostgreSQL infrastructure for the demo ERP.

## Start Database

```bash
docker compose up -d postgres
```

The database initializes from SQL files in `infra/postgres/init` the first time the Docker volume is created.

## Connection

- Host: `localhost`
- Port: `5432`
- Database: `demo_erp`
- User: `demo_erp`
- Password: `demo_erp_password`

Use `.env` to override these values locally.

