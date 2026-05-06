import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createApiHelper } from '../src/apiHelper';

test.describe('📝 Posts API', () => {
  test.beforeEach(async () => {
    allure.epic('API Tests');
    allure.feature('Posts');
  });

  test('GET /posts → deve retornar 100 posts', async ({ request }) => {
    allure.story('Listagem de posts');
    allure.severity('critical');
    allure.tag('smoke');
    allure.tag('GET');
    allure.description('Valida que o endpoint /posts retorna a lista completa de 100 posts.');

    const api = createApiHelper(request);
    const response = await api.getPosts(100);

    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts).toHaveLength(100);
  });

  test('GET /posts/1 → deve retornar primeiro post', async ({ request }) => {
    allure.story('Busca de post por ID');
    allure.severity('critical');
    allure.tag('smoke');
    allure.tag('GET');
    allure.description('Valida que o endpoint /posts/1 retorna o post correto com a estrutura esperada.');

    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post).toMatchObject({
      id: 1,
      userId: 1,
      title: expect.stringContaining('sunt aut'),
      body: expect.stringContaining('quia et'),
    });
  });

  test('GET /posts → todos os posts têm userId', async ({ request }) => {
    allure.story('Validação de estrutura');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');
    allure.description('Garante que todos os posts retornados possuem o campo userId do tipo número.');

    const api = createApiHelper(request);
    const response = await api.getPosts(100);
    const posts = await response.json();

    posts.forEach((post: any) => {
      expect(post).toHaveProperty('userId');
      expect(typeof post.userId).toBe('number');
    });
  });

  test('GET /posts/101 → post inexistente retorna 404', async ({ request }) => {
    allure.story('Tratamento de erro');
    allure.severity('critical');
    allure.tag('negative');
    allure.tag('GET');
    allure.description('Valida que requisição para post inexistente retorna status 404.');

    const response = await request.get('/posts/101');
    expect(response.status()).toBe(404);
  });

  test('GET /posts → deve ter títulos únicos', async ({ request }) => {
    allure.story('Validação de unicidade');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');
    allure.description('Verifica que não há duplicação de títulos entre os 100 posts.');

    const api = createApiHelper(request);
    const response = await api.getPosts(100);
    const posts = await response.json();

    const titles = posts.map((p: any) => p.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(posts.length);
  });

  test('GET /posts → deve ter corpos de texto', async ({ request }) => {
    allure.story('Validação de conteúdo');
    allure.severity('minor');
    allure.tag('regression');
    allure.tag('GET');
    allure.description('Garante que todos os posts possuem corpo (body) com conteúdo significativo.');

    const api = createApiHelper(request);
    const response = await api.getPosts(100);
    const posts = await response.json();

    posts.forEach((post: any) => {
      expect(post.body).toBeDefined();
      expect(post.body.length).toBeGreaterThan(10);
    });
  });

  test('GET /posts → validação de schema completo', async ({ request }) => {
    allure.story('Validação de schema');
    allure.severity('critical');
    allure.tag('contract');
    allure.tag('GET');
    allure.description('Valida o contrato completo da API: presença e tipagem de todos os campos obrigatórios.');

    const api = createApiHelper(request);
    const response = await api.getPosts(100);
    const posts = await response.json();

    posts.forEach((post: any) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');

      expect(typeof post.id).toBe('number');
      expect(typeof post.userId).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
    });
  });

  test('GET /posts → posts agrupados por userId', async ({ request }) => {
    allure.story('Análise de dados');
    allure.severity('minor');
    allure.tag('regression');
    allure.tag('GET');
    allure.description('Valida a distribuição esperada: 10 usuários com 10 posts cada.');

    const api = createApiHelper(request);
    const response = await api.getPosts(100);
    const posts = await response.json();

    const userPostCount: Record<number, number> = posts.reduce(
      (acc: Record<number, number>, post: any) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
      },
      {},
    );

    expect(Object.keys(userPostCount).length).toBe(10);
    expect(Math.max(...(Object.values(userPostCount) as number[]))).toBe(10);
  });
});
