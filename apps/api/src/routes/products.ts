import { Router } from 'express';

import { config } from '../config';
import { query } from '../db';
import { HttpError } from '../errors';

export const productsRouter = Router();

productsRouter.get('/', async (_request, response, next) => {
  try {
    const products = await query(
      `
        SELECT
          p.id,
          p.sku,
          p.name,
          p.description,
          p.unit_of_measure AS "unitOfMeasure",
          p.reorder_point AS "reorderPoint",
          p.status,
          COALESCE(SUM(b.quantity_on_hand), 0) AS "quantityOnHand"
        FROM erp.products p
        LEFT JOIN erp.inventory_balances b ON b.product_id = p.id
        WHERE p.organization_id = $1
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `,
      [config.demoOrganizationId],
    );

    response.json({ data: products });
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', async (request, response, next) => {
  try {
    const { sku, name, description, unitOfMeasure = 'each', reorderPoint = 0 } = request.body;

    const rows = await query(
      `
        INSERT INTO erp.products (organization_id, sku, name, description, unit_of_measure, reorder_point)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          sku,
          name,
          description,
          unit_of_measure AS "unitOfMeasure",
          reorder_point AS "reorderPoint",
          status,
          0 AS "quantityOnHand"
      `,
      [config.demoOrganizationId, sku, name, description ?? null, unitOfMeasure, reorderPoint],
    );

    response.status(201).json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

productsRouter.put('/:id', async (request, response, next) => {
  try {
    const { sku, name, description, unitOfMeasure, reorderPoint, status } = request.body;

    const rows = await query(
      `
        WITH updated_product AS (
          UPDATE erp.products
          SET
            sku = COALESCE($3, sku),
            name = COALESCE($4, name),
            description = COALESCE($5, description),
            unit_of_measure = COALESCE($6, unit_of_measure),
            reorder_point = COALESCE($7, reorder_point),
            status = COALESCE($8::erp.record_status, status),
            updated_at = now()
          WHERE id = $2
            AND organization_id = $1
          RETURNING *
        )
        SELECT
          p.id,
          p.sku,
          p.name,
          p.description,
          p.unit_of_measure AS "unitOfMeasure",
          p.reorder_point AS "reorderPoint",
          p.status,
          p.created_at AS "createdAt",
          p.updated_at AS "updatedAt",
          COALESCE(SUM(b.quantity_on_hand), 0) AS "quantityOnHand"
        FROM updated_product p
        LEFT JOIN erp.inventory_balances b ON b.product_id = p.id
        GROUP BY p.id, p.sku, p.name, p.description, p.unit_of_measure, p.reorder_point, p.status, p.created_at, p.updated_at
      `,
      [
        config.demoOrganizationId,
        request.params.id,
        sku ?? null,
        name ?? null,
        description ?? null,
        unitOfMeasure ?? null,
        reorderPoint ?? null,
        status ?? null,
      ],
    );

    if (!rows[0]) {
      throw new HttpError(404, 'Product not found');
    }

    response.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

productsRouter.delete('/:id', async (request, response, next) => {
  try {
    const rows = await query(
      `
        DELETE FROM erp.products
        WHERE id = $2
          AND organization_id = $1
        RETURNING id
      `,
      [config.demoOrganizationId, request.params.id],
    );

    if (!rows[0]) {
      throw new HttpError(404, 'Product not found');
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
