export type ExternalApiErrorKind =
  'timeout' | 'unavailable' | 'bad_status' | 'invalid_response';

export class ExternalApiError extends Error {
  constructor( message: string, readonly kind: ExternalApiErrorKind, options?: {cause?: unknown}) {
    super(message, { cause: options?.cause });
    this.name = 'ExternalApiError';
  }
}
