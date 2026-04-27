import { Router } from 'express';

import { config } from '../config';
import { query } from '../db';
import { HttpError } from '../errors';

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

customersRouter.put('/:id', async (request, response, next) => {
  try {
    const { code, name, partyType, status, taxIdentifier } = request.body;

    const rows = await query(
      `
        UPDATE erp.parties
        SET
          code = COALESCE($3, code),
          name = COALESCE($4, name),
          party_type = COALESCE($5::erp.party_type, party_type),
          status = COALESCE($6::erp.record_status, status),
          tax_identifier = COALESCE($7, tax_identifier),
          updated_at = now()
        WHERE id = $2
          AND organization_id = $1
          AND party_type IN ('customer', 'supplier')
        RETURNING id, code, name, party_type AS "partyType", status, created_at AS "createdAt", updated_at AS "updatedAt"
      `,
      [config.demoOrganizationId, request.params.id, code ?? null, name ?? null, partyType ?? null, status ?? null, taxIdentifier ?? null],
    );

    if (!rows[0]) {
      throw new HttpError(404, 'Customer or supplier not found');
    }

    response.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

customersRouter.delete('/:id', async (request, response, next) => {
  try {
    const rows = await query(
      `
        DELETE FROM erp.parties
        WHERE id = $2
          AND organization_id = $1
          AND party_type IN ('customer', 'supplier')
        RETURNING id
      `,
      [config.demoOrganizationId, request.params.id],
    );

    if (!rows[0]) {
      throw new HttpError(404, 'Customer or supplier not found');
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
