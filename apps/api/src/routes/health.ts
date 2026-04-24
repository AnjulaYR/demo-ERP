import { Router } from 'express';

import { query } from '../db';

export const healthRouter = Router();

healthRouter.get('/', async (_request, response, next) => {
  try {
    const rows = await query<{ now: string }>('SELECT now()');
    response.json({
      status: 'ok',
      databaseTime: rows[0]?.now,
    });
  } catch (error) {
    next(error);
  }
});

