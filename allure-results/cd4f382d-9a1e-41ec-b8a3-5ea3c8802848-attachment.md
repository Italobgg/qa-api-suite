# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comments.spec.ts >> 💬 Comments API >> GET /comments → IDs sequenciais de 1 a 500
- Location: tests\comments.spec.ts:82:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: undefined
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('💬 Comments API', () => {
  4  |   test('GET /comments → deve retornar 500 comentários', async ({ request }) => {
  5  |     const response = await request.get('/comments');
  6  |     expect(response.status()).toBe(200);
  7  |     const comments = await response.json();
  8  |     expect(comments).toHaveLength(500);
  9  |   });
  10 | 
  11 |   test('GET /comments/1 → deve retornar primeiro comentário', async ({ request }) => {
  12 |     const response = await request.get('/comments/1');
  13 |     expect(response.status()).toBe(200);
  14 |     const comment = await response.json();
  15 |     expect(comment.id).toBe(1);
  16 |     expect(comment.postId).toBe(1);
  17 |   });
  18 | 
  19 |   test('GET /comments → todos têm postId, name, email, body', async ({ request }) => {
  20 |     const response = await request.get('/comments');
  21 |     const comments = await response.json();
  22 | 
  23 |     comments.forEach((comment: any) => {
  24 |       expect(comment).toHaveProperty('postId');
  25 |       expect(comment).toHaveProperty('name');
  26 |       expect(comment).toHaveProperty('email');
  27 |       expect(comment).toHaveProperty('body');
  28 |     });
  29 |   });
  30 | 
  31 |   test('GET /comments/501 → comentário inexistente retorna 404', async ({ request }) => {
  32 |     const response = await request.get('/comments/501');
  33 |     expect(response.status()).toBe(404);
  34 |   });
  35 | 
  36 |   test('GET /comments → validar formato de email', async ({ request }) => {
  37 |     const response = await request.get('/comments');
  38 |     const comments = await response.json();
  39 |     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  40 |     comments.forEach((comment: any) => {
  41 |       expect(comment.email).toMatch(emailRegex);
  42 |     });
  43 |   });
  44 | 
  45 |   test('GET /comments → comentários agrupados por postId', async ({ request }) => {
  46 |     const response = await request.get('/comments');
  47 |     const comments = await response.json();
  48 |     const postIds = comments.map((c: any) => c.postId);
  49 |     const uniquePostIds = [...new Set(postIds)];
  50 |     expect(uniquePostIds).toContain(1);
  51 |     expect(uniquePostIds).toContain(100);
  52 |   });
  53 | 
  54 |   test('GET /comments → corpos de texto > 10 caracteres', async ({ request }) => {
  55 |     const response = await request.get('/comments');
  56 |     const comments = await response.json();
  57 |     comments.forEach((comment: any) => {
  58 |       expect(comment.body.length).toBeGreaterThan(10);
  59 |     });
  60 |   });
  61 | 
  62 |   test('GET /comments?postId=1 → filtrar comentários por post', async ({ request }) => {
  63 |     const response = await request.get('/comments?postId=1');
  64 |     expect(response.status()).toBe(200);
  65 |     const comments = await response.json();
  66 |     expect(comments.length).toBeGreaterThan(0);
  67 |     comments.forEach((comment: any) => {
  68 |       expect(comment.postId).toBe(1);
  69 |     });
  70 |   });
  71 | 
  72 |   test('GET /comments → nomes não vazios', async ({ request }) => {
  73 |     const response = await request.get('/comments');
  74 |     const comments = await response.json();
  75 |     comments.forEach((comment: any) => {
  76 |       expect(comment.name).not.toBe('');
  77 |       expect(comment.name).not.toBeNull();
  78 |       expect(comment.name).not.toBeUndefined();
  79 |     });
  80 |   });
  81 | 
  82 |   test('GET /comments → IDs sequenciais de 1 a 500', async ({ request }) => {
  83 |     const response = await request.get('/comments');
  84 |     const comments = await response.json();
  85 | 
  86 |     // Verifica se cada comentário tem ID sequencial
  87 |     comments.forEach((comment: any, index: number) => {
  88 |       expect(comment.id).toBe(index + 1);
  89 |     });
  90 | 
  91 |     // Valida primeiro e último elemento do array
> 92 |     expect(comments.id).toBe(1);           // ✅ Primeiro (índice 0)
     |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  93 |     expect(comments.id).toBe(500);     // ✅ Último (índice 499)
  94 |   });
  95 | });
  96 | 
```