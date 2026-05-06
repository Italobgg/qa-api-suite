import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createApiHelper } from '../src/apiHelper';

test.describe('💬 Comments API', () => {
  test.beforeEach(async () => {
    allure.epic('API Tests');
    allure.feature('Comments');
  });

  test('GET /comments → deve retornar 500 comentários', async ({ request }) => {
    allure.story('Listagem de comentários');
    allure.severity('critical');
    allure.tag('smoke');
    allure.tag('GET');
    allure.description('Valida que o endpoint /comments retorna a lista completa de 500 comentários.');

    const api = createApiHelper(request);
    const response = await api.getComments();

    expect(response.status()).toBe(200);
    const comments = await response.json();
    expect(comments).toHaveLength(500);
  });

  test('GET /comments/1 → deve retornar primeiro comentário', async ({ request }) => {
    allure.story('Busca por ID');
    allure.severity('critical');
    allure.tag('smoke');
    allure.tag('GET');

    const response = await request.get('/comments/1');
    expect(response.status()).toBe(200);
    const comment = await response.json();
    expect(comment.id).toBe(1);
    expect(comment.postId).toBe(1);
  });

  test('GET /comments → todos têm postId, name, email, body', async ({ request }) => {
    allure.story('Validação de schema');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');

    const api = createApiHelper(request);
    const response = await api.getComments();
    const comments = await response.json();

    comments.forEach((comment: any) => {
      expect(comment).toHaveProperty('postId');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
    });
  });

  test('GET /comments/501 → comentário inexistente retorna 404', async ({ request }) => {
    allure.story('Tratamento de erro');
    allure.severity('critical');
    allure.tag('negative');
    allure.tag('GET');

    const response = await request.get('/comments/501');
    expect(response.status()).toBe(404);
  });

  test('GET /comments → validar formato de email', async ({ request }) => {
    allure.story('Validação de formato');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');

    const api = createApiHelper(request);
    const response = await api.getComments();
    const comments = await response.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    comments.forEach((comment: any) => {
      expect(comment.email).toMatch(emailRegex);
    });
  });

  test('GET /comments → comentários agrupados por postId', async ({ request }) => {
    allure.story('Análise de dados');
    allure.severity('minor');
    allure.tag('regression');
    allure.tag('GET');

    const api = createApiHelper(request);
    const response = await api.getComments();
    const comments = await response.json();
    const postIds = comments.map((c: any) => c.postId);
    const uniquePostIds = [...new Set(postIds)];
    expect(uniquePostIds).toContain(1);
    expect(uniquePostIds).toContain(100);
  });

  test('GET /comments → corpos de texto > 10 caracteres', async ({ request }) => {
    allure.story('Validação de conteúdo');
    allure.severity('minor');
    allure.tag('regression');
    allure.tag('GET');

    const api = createApiHelper(request);
    const response = await api.getComments();
    const comments = await response.json();
    comments.forEach((comment: any) => {
      expect(comment.body.length).toBeGreaterThan(10);
    });
  });

  test('GET /comments?postId=1 → filtrar comentários por post', async ({ request }) => {
    allure.story('Filtros de query');
    allure.severity('normal');
    allure.tag('regression');
    allure.tag('GET');

    const response = await request.get('/comments?postId=1');
    expect(response.status()).toBe(200);
    const comments = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    comments.forEach((comment: any) => {
      expect(comment.postId).toBe(1);
    });
  });

  test('GET /comments → nomes não vazios', async ({ request }) => {
    allure.story('Validação de conteúdo');
    allure.severity('minor');
    allure.tag('regression');
    allure.tag('GET');

    const api = createApiHelper(request);
    const response = await api.getComments();
    const comments = await response.json();
    comments.forEach((comment: any) => {
      expect(comment.name).not.toBe('');
      expect(comment.name).not.toBeNull();
      expect(comment.name).not.toBeUndefined();
    });
  });

  test('GET /comments → IDs sequenciais de 1 a 500', async ({ request }) => {
    allure.story('Validação de unicidade');
    allure.severity('minor');
    allure.tag('regression');
    allure.tag('GET');

    const api = createApiHelper(request);
    const response = await api.getComments();
    const comments = await response.json();

    comments.forEach((comment: any, index: number) => {
      expect(comment.id).toBe(index + 1);
    });

    expect(comments[0].id).toBe(1);
    expect(comments[comments.length - 1].id).toBe(500);
  });
});
