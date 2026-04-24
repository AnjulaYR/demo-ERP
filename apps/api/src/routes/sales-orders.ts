import { Router } from 'express';

import { config } from '../config';
import { query } from '../db';

export const salesOrdersRouter = Router();

salesOrdersRouter.get('/', async (_request, response, next) => {
  try {
    const orders = await query(
      `
        SELECT
          so.id,
          so.order_number AS "orderNumber",
          so.order_date AS "orderDate",
          so.status,
          so.total_amount AS "totalAmount",
          p.name AS "customerName"
        FROM erp.sales_orders so
        JOIN erp.parties p ON p.id = so.customer_id
        WHERE so.organization_id = $1
        ORDER BY so.created_at DESC
      `,
      [config.demoOrganizationId],
    );

    response.json({ data: orders });
  } catch (error) {
    next(error);
  }
});

