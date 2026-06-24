export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const unwrapData = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Object.keys(payload as unknown as Record<string, unknown>).some((key) =>
      ['message', 'success', 'statusCode'].includes(key),
    )
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};
