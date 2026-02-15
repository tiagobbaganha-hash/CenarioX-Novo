import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { buildApp } from './app.js';

const app = buildApp();

describe('API smoke', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns health status', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
  });

  it('validates payload with zod', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/email/signin',
      payload: { email: 'invalid-email', password: '123' },
    });
    expect(response.statusCode).toBe(400);
  });
});
