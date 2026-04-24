import cors from 'cors';
import express from 'express';

import { config } from './config';
import { errorHandler, notFoundHandler } from './errors';
import { accountsRouter } from './routes/accounts';
import { customersRouter } from './routes/customers';
import { healthRouter } from './routes/health';
import { productsRouter } from './routes/products';
import { salesOrdersRouter } from './routes/sales-orders';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  }),
);
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales-orders', salesOrdersRouter);
app.use('/api/accounts', accountsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Demo ERP API listening on http://localhost:${config.port}`);
});

