# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comments.spec.ts >> 💬 Comments API >> GET /comments → IDs sequenciais de 1 a 500
- Location: tests\comments.spec.ts:105:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: undefined
```

# Test source

```ts
  13  |   test('GET /comments/1 → deve retornar primeiro comentário', async ({ request }) => {
  14  |     const response = await request.get('/comments/1');
  15  |     expect(response.status()).toBe(200);
  16  | 
  17  |     const comment = await response.json();
  18  |     expect(comment).toMatchObject({
  19  |       id: 1,
  20  |       postId: 1,
  21  |       name: expect.any(String),
  22  |       email: expect.any(String),
  23  |       body: expect.any(String)
  24  |     });
  25  |   });
  26  | 
  27  |   test('GET /comments → todos têm postId, name, email, body', async ({ request }) => {
  28  |     const response = await request.get('/comments');
  29  |     const comments = await response.json();
  30  | 
  31  |     comments.forEach((comment: any) => {
  32  |       expect(comment).toHaveProperty('id');
  33  |       expect(comment).toHaveProperty('postId');
  34  |       expect(comment).toHaveProperty('name');
  35  |       expect(comment).toHaveProperty('email');
  36  |       expect(comment).toHaveProperty('body');
  37  |       
  38  |       expect(typeof comment.id).toBe('number');
  39  |       expect(typeof comment.postId).toBe('number');
  40  |       expect(typeof comment.name).toBe('string');
  41  |       expect(typeof comment.email).toBe('string');
  42  |       expect(typeof comment.body).toBe('string');
  43  |     });
  44  |   });
  45  | 
  46  |   test('GET /comments/501 → comentário inexistente retorna 404', async ({ request }) => {
  47  |     const response = await request.get('/comments/501');
  48  |     expect(response.status()).toBe(404);
  49  |   });
  50  | 
  51  |   test('GET /comments → validar formato de email', async ({ request }) => {
  52  |     const response = await request.get('/comments');
  53  |     const comments = await response.json();
  54  | 
  55  |     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  56  | 
  57  |     comments.forEach((comment: any) => {
  58  |       expect(comment.email).toMatch(emailRegex);
  59  |     });
  60  |   });
  61  | 
  62  |   test('GET /comments → comentários agrupados por postId', async ({ request }) => {
  63  |     const response = await request.get('/comments');
  64  |     const comments = await response.json();
  65  | 
  66  |     const commentsByPost: Record<number, number> = comments.reduce((acc: Record<number, number>, comment: any) => {
  67  |       acc[comment.postId] = (acc[comment.postId] || 0) + 1;
  68  |       return acc;
  69  |     }, {});
  70  | 
  71  |     expect(Object.keys(commentsByPost).length).toBe(100);
  72  |     expect(Math.max(...Object.values(commentsByPost) as number[])).toBe(5);
  73  |   });
  74  | 
  75  |   test('GET /comments → corpos de texto > 10 caracteres', async ({ request }) => {
  76  |     const response = await request.get('/comments');
  77  |     const comments = await response.json();
  78  | 
  79  |     comments.forEach((comment: any) => {
  80  |       expect(comment.body.length).toBeGreaterThan(10);
  81  |     });
  82  |   });
  83  | 
  84  |   test('GET /comments?postId=1 → filtrar comentários por post', async ({ request }) => {
  85  |     const response = await request.get('/comments?postId=1');
  86  |     expect(response.status()).toBe(200);
  87  | 
  88  |     const comments = await response.json();
  89  |     expect(comments.length).toBe(5);
  90  |     
  91  |     comments.forEach((comment: any) => {
  92  |       expect(comment.postId).toBe(1);
  93  |     });
  94  |   });
  95  | 
  96  |   test('GET /comments → nomes não vazios', async ({ request }) => {
  97  |     const response = await request.get('/comments');
  98  |     const comments = await response.json();
  99  | 
  100 |     comments.forEach((comment: any) => {
  101 |       expect(comment.name.trim().length).toBeGreaterThan(0);
  102 |     });
  103 |   });
  104 | 
  105 |   test('GET /comments → IDs sequenciais de 1 a 500', async ({ request }) => {
  106 |     const response = await request.get('/comments');
  107 |     const comments = await response.json();
  108 | 
  109 |     comments.forEach((comment: any, index: number) => {
  110 |       expect(comment.id).toBe(index + 1);
  111 |     });
  112 | 
> 113 |     expect(comments.id).toBe(1);
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  114 |     expect(comments.id).toBe(500);
  115 |   });
  116 | 
  117 | });
  118 | 
```