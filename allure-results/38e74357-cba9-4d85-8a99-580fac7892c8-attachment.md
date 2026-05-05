# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comments.spec.ts >> 💬 Comments API >> GET /comments → IDs sequenciais de 1 a 500
- Location: tests\comments.spec.ts:92:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: undefined
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { createApiHelper } from '../helpers/api.helper';
  3   | 
  4   | test.describe('💬 Comments API', () => {
  5   |   test('GET /comments → deve retornar 500 comentários', async ({ request }) => {
  6   |     // ✅ Usa request direto, NÃO o helper (que filtra por postId)
  7   |     const response = await request.get('/comments');
  8   |     expect(response.status()).toBe(200);
  9   | 
  10  |     const comments = await response.json();
  11  |     expect(comments).toHaveLength(500);
  12  |   });
  13  | 
  14  |   test('GET /comments/1 → deve retornar primeiro comentário', async ({ request }) => {
  15  |     const response = await request.get('/comments/1');
  16  |     expect(response.status()).toBe(200);
  17  | 
  18  |     const comment = await response.json();
  19  |     expect(comment.id).toBe(1);
  20  |     expect(comment.postId).toBe(1);
  21  |   });
  22  | 
  23  |   test('GET /comments → todos têm postId, name, email, body', async ({ request }) => {
  24  |     const response = await request.get('/comments');
  25  |     const comments = await response.json();
  26  | 
  27  |     comments.forEach((comment: any) => {
  28  |       expect(comment).toHaveProperty('postId');
  29  |       expect(comment).toHaveProperty('name');
  30  |       expect(comment).toHaveProperty('email');
  31  |       expect(comment).toHaveProperty('body');
  32  |     });
  33  |   });
  34  | 
  35  |   test('GET /comments/501 → comentário inexistente retorna 404', async ({ request }) => {
  36  |     const response = await request.get('/comments/501');
  37  |     expect(response.status()).toBe(404);
  38  |   });
  39  | 
  40  |   test('GET /comments → validar formato de email', async ({ request }) => {
  41  |     const response = await request.get('/comments');
  42  |     const comments = await response.json();
  43  | 
  44  |     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  45  |     comments.forEach((comment: any) => {
  46  |       expect(comment.email).toMatch(emailRegex);
  47  |     });
  48  |   });
  49  | 
  50  |   test('GET /comments → comentários agrupados por postId', async ({ request }) => {
  51  |     const response = await request.get('/comments');
  52  |     const comments = await response.json();
  53  | 
  54  |     const postIds = comments.map((c: any) => c.postId);
  55  |     const uniquePostIds = [...new Set(postIds)];
  56  |     expect(uniquePostIds).toContain(1);
  57  |     expect(uniquePostIds).toContain(100);
  58  |   });
  59  | 
  60  |   test('GET /comments → corpos de texto > 10 caracteres', async ({ request }) => {
  61  |     const response = await request.get('/comments');
  62  |     const comments = await response.json();
  63  | 
  64  |     comments.forEach((comment: any) => {
  65  |       expect(comment.body.length).toBeGreaterThan(10);
  66  |     });
  67  |   });
  68  | 
  69  |   test('GET /comments?postId=1 → filtrar comentários por post', async ({ request }) => {
  70  |     // ✅ Aqui SIM usamos o helper (ou request direto com query param)
  71  |     const response = await request.get('/comments?postId=1');
  72  |     expect(response.status()).toBe(200);
  73  | 
  74  |     const comments = await response.json();
  75  |     expect(comments.length).toBeGreaterThan(0);
  76  |     comments.forEach((comment: any) => {
  77  |       expect(comment.postId).toBe(1);
  78  |     });
  79  |   });
  80  | 
  81  |   test('GET /comments → nomes não vazios', async ({ request }) => {
  82  |     const response = await request.get('/comments');
  83  |     const comments = await response.json();
  84  | 
  85  |     comments.forEach((comment: any) => {
  86  |       expect(comment.name).not.toBe('');
  87  |       expect(comment.name).not.toBeNull();
  88  |       expect(comment.name).not.toBeUndefined();
  89  |     });
  90  |   });
  91  | 
  92  |   test('GET /comments → IDs sequenciais de 1 a 500', async ({ request }) => {
  93  |     const response = await request.get('/comments');
  94  |     const comments = await response.json();
  95  | 
  96  |     comments.forEach((comment: any, index: number) => {
  97  |       expect(comment.id).toBe(index + 1);
  98  |     });
  99  | 
> 100 |     expect(comments.id).toBe(1);
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  101 |     expect(comments.id).toBe(500);
  102 |   });
  103 | });
  104 | 
```