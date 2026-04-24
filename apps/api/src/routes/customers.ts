import { Router } from 'express';

import { config } from '../config';
import { query } from '../db';

export const customersRouter = Router();

customersRouter.get('/', async (_request, response, next) => {
  try {
    const customers = await query(
      `
        SELECT id, code, name, party_type AS "partyType", status, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM erp.parties
        WHERE organization_id = $1
          AND party_type IN ('customer', 'supplier')
        ORDER BY created_at DESC
      `,
      [config.demoOrganizationId],
    );

    response.json({ data: customers });
  } catch (error) {
    next(error);
  }
});

customersRouter.post('/', async (request, response, next) => {
  try {
    const { code, name, partyType = 'customer', taxIdentifier } = request.body;

    const rows = await query(
      `
        INSERT INTO erp.parties (organization_id, party_type, code, name, tax_identifier)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, code, name, party_type AS "partyType", status, created_at AS "createdAt", updated_at AS "updatedAt"
      `,
      [config.demoOrganizationId, partyType, code, name, taxIdentifier ?? null],
    );

    response.status(201).json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

