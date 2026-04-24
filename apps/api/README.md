# Demo ERP API

Small local API for the Angular ERP frontends.

## Local Development

```bash
cp .env.example .env
npm install
npm run db:up
npm run api:dev
```

The API listens on `http://localhost:3000` by default.

## Starter Endpoints

- `GET /api/health`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/products`
- `POST /api/products`
- `GET /api/sales-orders`
- `GET /api/accounts`

