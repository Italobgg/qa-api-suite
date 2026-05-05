# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comments.spec.ts >> 💬 Comments API >> GET /comments → IDs sequenciais de 1 a 500
- Location: tests\comments.spec.ts:90:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: undefined
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('💬 Comments API', () => {
  4   |   
  5   |   test('GET /comments → deve retornar 500 comentários', async ({ request }) => {
  6   |     const response = await request.get('/comments');
  7   |     expect(response.status()).toBe(200);
  8   |     
  9   |     const comments = await response.json();
  10  |     expect(comments).toHaveLength(500);
  11  |   });
  12  | 
  13  |   test('GET /comments/1 → deve retornar primeiro comentário', async ({ request }) => {
  14  |     const response = await request.get('/comments/1');
  15  |     expect(response.status()).toBe(200);
  16  |     
  17  |     const comment = await response.json();
  18  |     expect(comment.id).toBe(1);
  19  |     expect(comment.postId).toBe(1);
  20  |   });
  21  | 
  22  |   test('GET /comments → todos têm postId, name, email, body', async ({ request }) => {
  23  |     const response = await request.get('/comments');
  24  |     const comments = await response.json();
  25  | 
  26  |     comments.forEach((comment: any) => {
  27  |       expect(comment).toHaveProperty('postId');
  28  |       expect(comment).toHaveProperty('name');
  29  |       expect(comment).toHaveProperty('email');
  30  |       expect(comment).toHaveProperty('body');
  31  |     });
  32  |   });
  33  | 
  34  |   test('GET /comments/501 → comentário inexistente retorna 404', async ({ request }) => {
  35  |     const response = await request.get('/comments/501');
  36  |     expect(response.status()).toBe(404);
  37  |   });
  38  | 
  39  |   test('GET /comments → validar formato de email', async ({ request }) => {
  40  |     const response = await request.get('/comments');
  41  |     const comments = await response.json();
  42  | 
  43  |     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  44  |     comments.forEach((comment: any) => {
  45  |       expect(comment.email).toMatch(emailRegex);
  46  |     });
  47  |   });
  48  | 
  49  |   test('GET /comments → comentários agrupados por postId', async ({ request }) => {
  50  |     const response = await request.get('/comments');
  51  |     const comments = await response.json();
  52  | 
  53  |     const postIds = comments.map((c: any) => c.postId);
  54  |     const uniquePostIds = [...new Set(postIds)];
  55  |     expect(uniquePostIds).toContain(1);
  56  |     expect(uniquePostIds).toContain(100);
  57  |   });
  58  | 
  59  |   test('GET /comments → corpos de texto > 10 caracteres', async ({ request }) => {
  60  |     const response = await request.get('/comments');
  61  |     const comments = await response.json();
  62  | 
  63  |     comments.forEach((comment: any) => {
  64  |       expect(comment.body.length).toBeGreaterThan(10);
  65  |     });
  66  |   });
  67  | 
  68  |   test('GET /comments?postId=1 → filtrar comentários por post', async ({ request }) => {
  69  |     const response = await request.get('/comments?postId=1');
  70  |     expect(response.status()).toBe(200);
  71  |     
  72  |     const comments = await response.json();
  73  |     expect(comments.length).toBeGreaterThan(0);
  74  |     comments.forEach((comment: any) => {
  75  |       expect(comment.postId).toBe(1);
  76  |     });
  77  |   });
  78  | 
  79  |   test('GET /comments → nomes não vazios', async ({ request }) => {
  80  |     const response = await request.get('/comments');
  81  |     const comments = await response.json();
  82  | 
  83  |     comments.forEach((comment: any) => {
  84  |       expect(comment.name).not.toBe('');
  85  |       expect(comment.name).not.toBeNull();
  86  |       expect(comment.name).not.toBeUndefined();
  87  |     });
  88  |   });
  89  | 
  90  |   test('GET /comments → IDs sequenciais de 1 a 500', async ({ request }) => {
  91  |     const response = await request.get('/comments');
  92  |     const comments = await response.json();
  93  | 
  94  |     comments.forEach((comment: any, index: number) => {
  95  |       expect(comment.id).toBe(index + 1);
  96  |     });
  97  | 
> 98  |     expect(comments.id).toBe(1);           // ✅ Primeiro elemento
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  99  |     expect(comments.id).toBe(500);       // ✅ Último elemento
  100 |   });
  101 | });
  102 | 
```