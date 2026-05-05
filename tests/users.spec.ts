import { test, expect } from '@playwright/test';
import { createApiHelper } from '../helpers/api.helper';

test.describe('👥 Users API', () => {
  test('GET /users → deve retornar 10 usuários', async ({ request }) => {
    const api = createApiHelper(request);
    const response = await api.getUser(1); // ou request.get('/users') direto
    
    const body = await request.get('/users').then(r => r.json());
    expect(body).toHaveLength(10);

    body.forEach((user: any) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('phone');
      expect(typeof user.id).toBe('number');
    });
  });

  test('GET /users/1 → deve retornar usuário Leanne Graham', async ({ request }) => {
    const api = createApiHelper(request);
    const response = await api.getUser(1);

    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toMatchObject({
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    });
  });

  test('GET /users → deve validar formato de email', async ({ request }) => {
    const response = await request.get('/users');
    const users = await response.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    users.forEach((user: any) => {
      expect(user.email).toMatch(emailRegex);
    });

    const domains = users.map((u: any) => u.email.split('@')[1]);
    expect(new Set(domains).size).toBeGreaterThan(1);
  });

  test('GET /users/99 → usuário inexistente retorna 404', async ({ request }) => {
    const response = await request.get('/users/99');
    expect(response.status()).toBe(404);
  });

  test('GET /users → deve validar que todos têm empresa', async ({ request }) => {
    const response = await request.get('/users');
    const users = await response.json();

    users.forEach((user: any) => {
      expect(user).toHaveProperty('company');
      expect(user.company).toHaveProperty('name');
    });
  });
});
