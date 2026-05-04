# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: users.spec.ts >> 👥 Users API >> GET /users → deve filtrar usuários por email do Google
- Location: tests\users.spec.ts:37:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 2
Received length: 0
Received array:  []
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('👥 Users API', () => {
  4  | 
  5  |   test('GET /users → deve retornar 10 usuários', async ({ request }) => {
  6  |     const response = await request.get('/users');
  7  | 
  8  |     expect(response.status()).toBe(200);
  9  | 
  10 |     const body = await response.json();
  11 |     expect(body).toHaveLength(10);
  12 |     
  13 |     // Validação de schema básico
  14 |     body.forEach((user: any) => {
  15 |       expect(user).toHaveProperty('id');
  16 |       expect(user).toHaveProperty('name');
  17 |       expect(user).toHaveProperty('email');
  18 |       expect(user).toHaveProperty('phone');
  19 |       expect(typeof user.id).toBe('number');
  20 |     });
  21 |   });
  22 | 
  23 |   test('GET /users/1 → deve retornar usuário Leanne Graham', async ({ request }) => {
  24 |     const response = await request.get('/users/1');
  25 | 
  26 |     expect(response.status()).toBe(200);
  27 | 
  28 |     const user = await response.json();
  29 |     expect(user).toMatchObject({
  30 |       id: 1,
  31 |       name: 'Leanne Graham',
  32 |       username: 'Bret',
  33 |       email: 'Sincere@april.biz',
  34 |     });
  35 |   });
  36 | 
  37 |   test('GET /users → deve filtrar usuários por email do Google', async ({ request }) => {
  38 |     const response = await request.get('/users');
  39 |     const users = await response.json();
  40 | 
  41 |     const googleUsers = users.filter((user: any) => 
  42 |       user.email.includes('google')
  43 |     );
  44 | 
> 45 |     expect(googleUsers).toHaveLength(2);
     |                         ^ Error: expect(received).toHaveLength(expected)
  46 |     expect(googleUsers.email).toBe('Karianne@jasper.info');
  47 |   });
  48 | 
  49 |   test('GET /users/99 → usuário inexistente deve retornar 404', async ({ request }) => {
  50 |     const response = await request.get('/users/99');
  51 |     expect(response.status()).toBe(404);
  52 |   });
  53 | 
  54 |   test('GET /users → deve validar que todos têm empresa', async ({ request }) => {
  55 |     const response = await request.get('/users');
  56 |     const users = await response.json();
  57 | 
  58 |     users.forEach((user: any) => {
  59 |       expect(user).toHaveProperty('company');
  60 |       expect(user.company).toHaveProperty('name');
  61 |     });
  62 |   });
  63 | 
  64 | });
  65 | 
```