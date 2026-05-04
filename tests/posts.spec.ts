import { test, expect } from '@playwright/test';

test.describe('📝 Posts API', () => {

  test('GET /posts → deve retornar 100 posts', async ({ request }) => {
    const response = await request.get('/posts');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveLength(100);
  });

  test('GET /posts/1 → deve retornar post correto', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      userId: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('POST /posts → deve criar novo post', async ({ request }) => {
    const response = await request.post('/posts', {
      data: {
        title: 'QA Automation Test',
        body: 'Criado via Playwright',
        userId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('QA Automation Test');
    expect(body.id).toBeTruthy();
  });

  test('PUT /posts/1 → deve atualizar post', async ({ request }) => {
    const response = await request.put('/posts/1', {
      data: {
        id: 1,
        title: 'Título Atualizado',
        body: 'Conteúdo atualizado',
        userId: 1,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Título Atualizado');
  });

  test('DELETE /posts/1 → deve deletar post', async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
  });

  test('GET /posts/999 → post inexistente deve retornar 404', async ({ request }) => {
    const response = await request.get('/posts/999');
    expect(response.status()).toBe(404);
  });

});