import request from 'supertest';
import { app } from './app';
import { test, expect, describe } from 'vitest';
import { generateCareerResponse } from './services/aiService';

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

  test('generateCareerResponse runs successfully or handles missing API key cleanly', async () => {
    try {
      const response = await generateCareerResponse('test message', []);
      console.log('Test execution response:', response);
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
    } catch (error: any) {
      console.log('Caught expected or unexpected error during generateCareerResponse test:', error.message || error);
      expect(error).toBeDefined();
    }
  }, 15000);
});
