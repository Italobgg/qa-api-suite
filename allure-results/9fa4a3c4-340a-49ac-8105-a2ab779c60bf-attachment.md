# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comments.spec.ts >> 💬 Comments API >> GET /comments → IDs sequenciais de 1 a 500
- Location: tests\comments.spec.ts:94:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: undefined
```

# Test source

```ts
  4   |   test("GET /comments → deve retornar 500 comentários", async ({ request }) => {
  5   |     const response = await request.get("/comments");
  6   |     expect(response.status()).toBe(200);
  7   |     const comments = await response.json();
  8   |     expect(comments).toHaveLength(500);
  9   |   });
  10  | 
  11  |   test("GET /comments/1 → deve retornar primeiro comentário", async ({
  12  |     request,
  13  |   }) => {
  14  |     const response = await request.get("/comments/1");
  15  |     expect(response.status()).toBe(200);
  16  |     const comment = await response.json();
  17  |     expect(comment.id).toBe(1);
  18  |     expect(comment.postId).toBe(1);
  19  |   });
  20  | 
  21  |   test("GET /comments → todos têm postId, name, email, body", async ({
  22  |     request,
  23  |   }) => {
  24  |     const response = await request.get("/comments");
  25  |     const comments = await response.json();
  26  | 
  27  |     comments.forEach((comment: any) => {
  28  |       expect(comment).toHaveProperty("postId");
  29  |       expect(comment).toHaveProperty("name");
  30  |       expect(comment).toHaveProperty("email");
  31  |       expect(comment).toHaveProperty("body");
  32  |     });
  33  |   });
  34  | 
  35  |   test("GET /comments/501 → comentário inexistente retorna 404", async ({
  36  |     request,
  37  |   }) => {
  38  |     const response = await request.get("/comments/501");
  39  |     expect(response.status()).toBe(404);
  40  |   });
  41  | 
  42  |   test("GET /comments → validar formato de email", async ({ request }) => {
  43  |     const response = await request.get("/comments");
  44  |     const comments = await response.json();
  45  |     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  46  |     comments.forEach((comment: any) => {
  47  |       expect(comment.email).toMatch(emailRegex);
  48  |     });
  49  |   });
  50  | 
  51  |   test("GET /comments → comentários agrupados por postId", async ({
  52  |     request,
  53  |   }) => {
  54  |     const response = await request.get("/comments");
  55  |     const comments = await response.json();
  56  |     const postIds = comments.map((c: any) => c.postId);
  57  |     const uniquePostIds = [...new Set(postIds)];
  58  |     expect(uniquePostIds).toContain(1);
  59  |     expect(uniquePostIds).toContain(100);
  60  |   });
  61  | 
  62  |   test("GET /comments → corpos de texto > 10 caracteres", async ({
  63  |     request,
  64  |   }) => {
  65  |     const response = await request.get("/comments");
  66  |     const comments = await response.json();
  67  |     comments.forEach((comment: any) => {
  68  |       expect(comment.body.length).toBeGreaterThan(10);
  69  |     });
  70  |   });
  71  | 
  72  |   test("GET /comments?postId=1 → filtrar comentários por post", async ({
  73  |     request,
  74  |   }) => {
  75  |     const response = await request.get("/comments?postId=1");
  76  |     expect(response.status()).toBe(200);
  77  |     const comments = await response.json();
  78  |     expect(comments.length).toBeGreaterThan(0);
  79  |     comments.forEach((comment: any) => {
  80  |       expect(comment.postId).toBe(1);
  81  |     });
  82  |   });
  83  | 
  84  |   test("GET /comments → nomes não vazios", async ({ request }) => {
  85  |     const response = await request.get("/comments");
  86  |     const comments = await response.json();
  87  |     comments.forEach((comment: any) => {
  88  |       expect(comment.name).not.toBe("");
  89  |       expect(comment.name).not.toBeNull();
  90  |       expect(comment.name).not.toBeUndefined();
  91  |     });
  92  |   });
  93  | 
  94  |   test("GET /comments → IDs sequenciais de 1 a 500", async ({ request }) => {
  95  |     const response = await request.get("/comments");
  96  |     const comments = await response.json();
  97  | 
  98  |     // Verifica cada comentário
  99  |     comments.forEach((comment: any, index: number) => {
  100 |       expect(comment.id).toBe(index + 1);
  101 |     });
  102 | 
  103 |     // Valida primeiro e último elemento
> 104 |     expect(comments.id).toBe(1); // ✅ Primeiro elemento (índice 0)
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  105 |     expect(comments.id).toBe(500); // ✅ Último elemento (índice 499)
  106 |   });
  107 | });
  108 | 
```