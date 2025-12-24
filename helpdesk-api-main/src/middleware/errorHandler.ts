import { Request, Response, NextFunction } from 'express';

function isDbError(err: unknown): err is { code?: string; errno?: number; message?: string } {
  if (typeof err !== 'object' || err === null) return false;
  const msg = (err as { message?: string }).message;
  return 'code' in err || 'errno' in err || (typeof msg === 'string' && msg.includes('SQLITE'));
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Log with stack for diagnostics
  if (err instanceof Error && err.stack) console.error(err.stack);
  else console.error(err);

  if (res.headersSent) return next(err as unknown as Error);

  // Map known DB errors to a friendly message without leaking internals
  if (isDbError(err)) {
    return res.status(500).json({ message: 'Database error' });
  }

  const status = (typeof err === 'object' && err !== null && 'status' in err && Number((err as { status?: number | string }).status) >= 400) ? Number((err as { status?: number | string }).status) : 500;
  const payload: Record<string, unknown> = { message: (err instanceof Error && err.message) ? err.message : 'Server error' };

  // In non-production include error details for easier debugging
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = (err instanceof Error && err.stack) ? err.stack : undefined;
    if (typeof err === 'object' && err !== null && 'code' in err) payload.code = (err as { code?: string }).code;
  }

  res.status(status).json(payload);
}
