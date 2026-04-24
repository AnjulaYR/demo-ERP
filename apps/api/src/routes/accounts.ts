import { Router } from 'express';

import { config } from '../config';
import { query } from '../db';

export const accountsRouter = Router();

accountsRouter.get('/', async (_request, response, next) => {
  try {
    const accounts = await query(
      `
        SELECT
          id,
          account_code AS "accountCode",
          account_name AS "accountName",
          account_type AS "accountType",
          parent_account_id AS "parentAccountId",
          status
        FROM erp.chart_of_accounts
        WHERE organization_id = $1
        ORDER BY account_code
      `,
      [config.demoOrganizationId],
    );

    response.json({ data: accounts });
  } catch (error) {
    next(error);
  }
});

