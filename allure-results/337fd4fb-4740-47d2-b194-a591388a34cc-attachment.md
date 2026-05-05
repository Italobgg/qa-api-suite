# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comments.spec.ts >> 💬 Comments API >> GET /comments → deve retornar 500 comentários
- Location: tests\comments.spec.ts:5:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 500
Received length: 5
Received array:  [{"body": "laudantium enim quasi est quidem magnam voluptate ipsam eos
tempora quo necessitatibus
dolor quam autem quasi
reiciendis et nam sapiente accusantium", "email": "Eliseo@gardner.biz", "id": 1, "name": "id labore ex et quam laborum", "postId": 1}, {"body": "est natus enim nihil est dolore omnis voluptatem numquam
et omnis occaecati quod ullam at
voluptatem error expedita pariatur
nihil sint nostrum voluptatem reiciendis et", "email": "Jayne_Kuhic@sydney.com", "id": 2, "name": "quo vero reiciendis velit similique earum", "postId": 1}, {"body": "quia molestiae reprehenderit quasi aspernatur
aut expedita occaecati aliquam eveniet laudantium
omnis quibusdam delectus saepe quia accusamus maiores nam est
cum et ducimus et vero voluptates excepturi deleniti ratione", "email": "Nikita@garfield.biz", "id": 3, "name": "odio adipisci rerum aut animi", "postId": 1}, {"body": "non et atque
occaecati deserunt quas accusantium unde odit nobis qui voluptatem
quia voluptas consequuntur itaque dolor
et qui rerum deleniti ut occaecati", "email": "Lew@alysha.tv", "id": 4, "name": "alias odio sit", "postId": 1}, {"body": "harum non quasi et ratione
tempore iure ex voluptates in ratione
harum architecto fugit inventore cupiditate
voluptates magni quo et", "email": "Hayden@althea.biz", "id": 5, "name": "vero eaque aliquid doloribus et culpa", "postId": 1}]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { createApiHelper } from '../helpers/api.helper';
  3  | 
  4  | test.describe('💬 Comments API', () => {
  5  |   test('GET /comments → deve retornar 500 comentários', async ({ request }) => {
  6  |     const api = createApiHelper(request);
  7  |     const response = await api.getCommentsByPostId(1);
  8  |     
  9  |     expect(response.status()).toBe(200);
  10 |     const comments = await response.json();
> 11 |     expect(comments).toHaveLength(500);
     |                      ^ Error: expect(received).toHaveLength(expected)
  12 |   });
  13 | 
  14 |   test('GET /comments/1 → deve retornar primeiro comentário', async ({ request }) => {
  15 |     const response = await request.get('/comments/1'); // Mantém direto aqui
  16 |     expect(response.status()).toBe(200);
  17 |     const comment = await response.json();
  18 |     expect(comment.id).toBe(1);
  19 |   });
  20 | 
  21 |   test('GET /comments → todos têm postId, name, email, body', async ({ request }) => {
  22 |     const api = createApiHelper(request);
  23 |     const response = await api.getCommentsByPostId(1);
  24 |     const comments = await response.json();
  25 | 
  26 |     comments.forEach((comment: any) => {
  27 |       expect(comment).toHaveProperty('postId');
  28 |       expect(comment).toHaveProperty('name');
  29 |       expect(comment).toHaveProperty('email');
  30 |       expect(comment).toHaveProperty('body');
  31 |     });
  32 |   });
  33 | 
  34 |   test('GET /comments?postId=1 → filtrar comentários por post', async ({ request }) => {
  35 |     const api = createApiHelper(request);
  36 |     const response = await api.getCommentsByPostId(1);
  37 |     
  38 |     expect(response.status()).toBe(200);
  39 |     const comments = await response.json();
  40 |     expect(comments.length).toBeGreaterThan(0);
  41 |     comments.forEach((comment: any) => {
  42 |       expect(comment.postId).toBe(1);
  43 |     });
  44 |   });
  45 | });
  46 | 
```