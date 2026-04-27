import type { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function notFoundHandler(_request: Request, _response: Response, next: NextFunction): void {
  next(new HttpError(404, 'API route not found'));
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  const mappedError = mapError(error);

  response.status(mappedError.statusCode).json({
    error: {
      message: mappedError.message,
      statusCode: mappedError.statusCode,
    },
  });
}

function mapError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (isPostgresError(error)) {
    if (error.code === '23505') {
      return new HttpError(409, 'A record with the same unique value already exists');
    }

    if (error.code === '22P02' || error.code === '23502') {
      return new HttpError(400, 'The submitted data is not valid for this record');
    }

    if (error.code === '23503') {
      return new HttpError(409, 'This record is linked to other ERP data');
    }
  }

  const message = error instanceof Error ? error.message : 'Unexpected API error';
  return new HttpError(500, message);
}

function isPostgresError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}
