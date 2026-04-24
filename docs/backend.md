# Backend Architecture

## Local Stack

- PostgreSQL runs through Docker Compose.
- The API runs as a Node/Express TypeScript service in `apps/api`.
- Angular dev servers call the API through `/api`, proxied to `http://localhost:3000`.

## Database Shape

The schema separates authentication from ERP domain data:

- `auth.users`, `auth.roles`, `auth.permissions`, `auth.sessions`
- `erp.organizations`, `erp.business_units`
- `erp.parties`, `erp.party_contacts`, `erp.addresses`
- `erp.products`, `erp.warehouses`, `erp.inventory_balances`, `erp.stock_movements`
- `erp.sales_orders`, `erp.sales_order_lines`, `erp.invoices`
- `erp.chart_of_accounts`, `erp.journal_entries`, `erp.journal_lines`, `erp.payments`
- `erp.audit_events`

`erp.parties` generalizes customers, suppliers, employees, and partners so contact and address data can be shared instead of duplicated.

## Startup

```bash
npm install
npm run db:up
npm run api:dev
```

The database initialization scripts run only when the Docker volume is created for the first time.

## Current Limitation

Docker must be installed and available in `PATH` before `npm run db:up` can work. If Docker is unavailable, the schema and API code can still be reviewed and typechecked, but PostgreSQL cannot be started locally.

## API Upgrade Path

The first API exposes read/create endpoints for core ERP data. Next steps are:

- Add migration tooling instead of relying only on Docker initialization scripts.
- Add password hashing and session issuance for `auth.users`.
- Add API authorization middleware using role permissions.
- Replace frontend mock rows with `libs/shared/api-client` calls domain by domain.
