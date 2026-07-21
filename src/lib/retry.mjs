import { sleep } from './utils.mjs';

export async function withRetry(operation, { retries = 3, baseDelayMs = 500, shouldRetry = () => true, onRetry = () => {} } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try { return await operation(attempt); }
    catch (error) {
      lastError = error;
      if (attempt >= retries || !shouldRetry(error)) throw error;
      const delay = baseDelayMs * (2 ** attempt);
      onRetry({ attempt:attempt+1, delay, error:error.message });
      await sleep(delay);
    }
  }
  throw lastError;
}
