import { test, expect } from "@playwright/test";

test.describe("📝 Posts API", () => {
  test("GET /posts → deve retornar 100 posts", async ({ request }) => {
    const response = await request.get("/posts");
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts).toHaveLength(100);
  });

  test("GET /posts/1 → deve retornar primeiro post", async ({ request }) => {
    const response = await request.get("/posts/1");
    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post).toMatchObject({
      id: 1,
      userId: 1,
      title: expect.stringContaining("sunt aut"),
      body: expect.stringContaining("quia et"),
    });
  });

  test("GET /posts → todos os posts têm userId", async ({ request }) => {
    const response = await request.get("/posts");
    const posts = await response.json();

    posts.forEach((post: any) => {
      expect(post).toHaveProperty("userId");
      expect(typeof post.userId).toBe("number");
    });
  });

  test("GET /posts/101 → post inexistente retorna 404", async ({ request }) => {
    const response = await request.get("/posts/101");
    expect(response.status()).toBe(404);
  });

  test("GET /posts → deve ter títulos únicos", async ({ request }) => {
    const response = await request.get("/posts");
    const posts = await response.json();

    const titles = posts.map((p: any) => p.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(posts.length);
  });

  test("GET /posts → deve ter corpos de texto", async ({ request }) => {
    const response = await request.get("/posts");
    const posts = await response.json();

    posts.forEach((post: any) => {
      expect(post.body).toBeDefined();
      expect(post.body.length).toBeGreaterThan(10);
    });
  });

  test("GET /posts → validação de schema completo", async ({ request }) => {
    const response = await request.get("/posts");
    const posts = await response.json();

    posts.forEach((post: any) => {
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("userId");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("body");

      expect(typeof post.id).toBe("number");
      expect(typeof post.userId).toBe("number");
      expect(typeof post.title).toBe("string");
      expect(typeof post.body).toBe("string");
    });
  });

  test("GET /posts → posts agrupados por userId", async ({ request }) => {
    const response = await request.get("/posts");
    const posts = await response.json();

    const userPostCount: Record<number, number> = posts.reduce(
      (acc: Record<number, number>, post: any) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
      },
      {},
    );

    expect(Object.keys(userPostCount).length).toBe(10);
    expect(Math.max(...(Object.values(userPostCount) as number[]))).toBe(10); // ← MUDOU 12 → 10
  });
});
