import logger from './logger';

export class SolanaError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'SolanaError';
  }
}

export function handleError(error: Error | SolanaError, operation: string): void {
  if (error instanceof SolanaError) {
    logger.error(`${operation} failed:`, {
      message: error.message,
      code: error.code,
      details: error.originalError
    });
  } else {
    logger.error(`Unexpected error during ${operation}:`, error);
  }
  process.exit(1);
}
