import request from 'supertest';
import { app } from './app';
import { test, expect, describe } from 'vitest';

describe('API Endpoints', () => {
  test('health check returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('chat endpoint responds 400 with invalid body', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({
        // missing message
      });

    expect(response.status).toBe(400);
  });
});
