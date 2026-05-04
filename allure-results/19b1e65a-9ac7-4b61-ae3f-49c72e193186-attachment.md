# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: posts.spec.ts >> 📝 Posts API >> GET /posts → posts agrupados por userId
- Location: tests\posts.spec.ts:77:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 12
Received: 10
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('📝 Posts API', () => {
  4  | 
  5  |   test('GET /posts → deve retornar 100 posts', async ({ request }) => {
  6  |     const response = await request.get('/posts');
  7  |     expect(response.status()).toBe(200);
  8  | 
  9  |     const posts = await response.json();
  10 |     expect(posts).toHaveLength(100);
  11 |   });
  12 | 
  13 |   test('GET /posts/1 → deve retornar primeiro post', async ({ request }) => {
  14 |     const response = await request.get('/posts/1');
  15 |     expect(response.status()).toBe(200);
  16 | 
  17 |     const post = await response.json();
  18 |     expect(post).toMatchObject({
  19 |       id: 1,
  20 |       userId: 1,
  21 |       title: expect.stringContaining('sunt aut'),
  22 |       body: expect.stringContaining('quia et')
  23 |     });
  24 |   });
  25 | 
  26 |   test('GET /posts → todos os posts têm userId', async ({ request }) => {
  27 |     const response = await request.get('/posts');
  28 |     const posts = await response.json();
  29 | 
  30 |     posts.forEach((post: any) => {
  31 |       expect(post).toHaveProperty('userId');
  32 |       expect(typeof post.userId).toBe('number');
  33 |     });
  34 |   });
  35 | 
  36 |   test('GET /posts/101 → post inexistente retorna 404', async ({ request }) => {
  37 |     const response = await request.get('/posts/101');
  38 |     expect(response.status()).toBe(404);
  39 |   });
  40 | 
  41 |   test('GET /posts → deve ter títulos únicos', async ({ request }) => {
  42 |     const response = await request.get('/posts');
  43 |     const posts = await response.json();
  44 | 
  45 |     const titles = posts.map((p: any) => p.title);
  46 |     const uniqueTitles = new Set(titles);
  47 |     expect(uniqueTitles.size).toBe(posts.length);
  48 |   });
  49 | 
  50 |   test('GET /posts → deve ter corpos de texto', async ({ request }) => {
  51 |     const response = await request.get('/posts');
  52 |     const posts = await response.json();
  53 | 
  54 |     posts.forEach((post: any) => {
  55 |       expect(post.body).toBeDefined();
  56 |       expect(post.body.length).toBeGreaterThan(10);
  57 |     });
  58 |   });
  59 | 
  60 |   test('GET /posts → validação de schema completo', async ({ request }) => {
  61 |     const response = await request.get('/posts');
  62 |     const posts = await response.json();
  63 | 
  64 |     posts.forEach((post: any) => {
  65 |       expect(post).toHaveProperty('id');
  66 |       expect(post).toHaveProperty('userId');
  67 |       expect(post).toHaveProperty('title');
  68 |       expect(post).toHaveProperty('body');
  69 |       
  70 |       expect(typeof post.id).toBe('number');
  71 |       expect(typeof post.userId).toBe('number');
  72 |       expect(typeof post.title).toBe('string');
  73 |       expect(typeof post.body).toBe('string');
  74 |     });
  75 |   });
  76 | 
  77 |   test('GET /posts → posts agrupados por userId', async ({ request }) => {
  78 |     const response = await request.get('/posts');
  79 |     const posts = await response.json();
  80 | 
  81 |     const userPostCount: Record<number, number> = posts.reduce((acc: Record<number, number>, post: any) => {
  82 |       acc[post.userId] = (acc[post.userId] || 0) + 1;
  83 |       return acc;
  84 |     }, {});
  85 | 
  86 |     expect(Object.keys(userPostCount).length).toBe(10);
> 87 |     expect(Math.max(...Object.values(userPostCount) as number[])).toBe(12);
     |                                                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  88 |   });
  89 | 
  90 | });
```