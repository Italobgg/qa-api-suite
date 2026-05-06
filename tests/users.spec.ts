import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createApiHelper } from '../src/apiHelper';

test.describe('👥 Users API', () => {
  test.beforeEach(async () => {
    allure.epic('API Tests');
    allure.feature('Users');
  });

  test('GET /users → deve retornar 10 usuários', async ({ request }) => {
    allure.story('Listagem de usuários');
    allure.severity('critical');
    allure.tag('smoke');
    allure.tag('GET');
    allure.description('Valida que o endpoint /users retorna a lista completa de 10 usuários com os campos obrigatórios.');

    const api = createApiHelper(request);
    const response = await api.getUsers();

    expect(response.status()).toBe(200);
    const body = await response.json();
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
    allure.story('Busca de usuário por ID');
    allure.severity('critical');
    allure.tag('smoke');
    allure.tag('GET');
    allure.description('Valida que o endpoint /users/1 retorna o usuário Leanne Graham com os dados corretos.');

    const api = createApiHelper(request);
    const response = await api.getUserById(1);

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
    allure.story('Validação de formato');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');
    allure.description('Garante que todos os emails dos usuários seguem o formato válido e que há diversidade de domínios.');

    const api = createApiHelper(request);
    const response = await api.getUsers();
    const users = await response.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    users.forEach((user: any) => {
      expect(user.email).toMatch(emailRegex);
    });

    const domains = users.map((u: any) => u.email.split('@')[1]);
    expect(new Set(domains).size).toBeGreaterThan(1);
  });

  test('GET /users/99 → usuário inexistente retorna 404', async ({ request }) => {
    allure.story('Tratamento de erro');
    allure.severity('critical');
    allure.tag('negative');
    allure.tag('GET');
    allure.description('Valida que requisição para usuário inexistente retorna status 404.');

    const api = createApiHelper(request);
    const response = await api.getUserById(99);
    expect(response.status()).toBe(404);
  });

  test('GET /users → deve validar que todos têm empresa', async ({ request }) => {
    allure.story('Validação de schema');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');
    allure.description('Garante que todos os usuários possuem dados de empresa estruturados corretamente.');

    const api = createApiHelper(request);
    const response = await api.getUsers();
    const users = await response.json();

    users.forEach((user: any) => {
      expect(user).toHaveProperty('company');
      expect(user.company).toHaveProperty('name');
    });
  });
});
