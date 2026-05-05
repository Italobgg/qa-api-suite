import { test, expect } from "@playwright/test";

test.describe("💬 Comments API", () => {
  test("GET /comments → deve retornar 500 comentários", async ({ request }) => {
    const response = await request.get("/comments");
    expect(response.status()).toBe(200);

    const comments = await response.json();
    expect(comments).toHaveLength(500);
  });

  test("GET /comments/1 → deve retornar primeiro comentário", async ({
    request,
  }) => {
    const response = await request.get("/comments/1");
    expect(response.status()).toBe(200);

    const comment = await response.json();
    expect(comment.id).toBe(1);
    expect(comment.postId).toBe(1);
  });

  test("GET /comments → todos têm postId, name, email, body", async ({
    request,
  }) => {
    const response = await request.get("/comments");
    const comments = await response.json();

    comments.forEach((comment: any) => {
      expect(comment).toHaveProperty("postId");
      expect(comment).toHaveProperty("name");
      expect(comment).toHaveProperty("email");
      expect(comment).toHaveProperty("body");
    });
  });

  test("GET /comments/501 → comentário inexistente retorna 404", async ({
    request,
  }) => {
    const response = await request.get("/comments/501");
    expect(response.status()).toBe(404);
  });

  test("GET /comments → validar formato de email", async ({ request }) => {
    const response = await request.get("/comments");
    const comments = await response.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    comments.forEach((comment: any) => {
      expect(comment.email).toMatch(emailRegex);
    });
  });

  test("GET /comments → comentários agrupados por postId", async ({
    request,
  }) => {
    const response = await request.get("/comments");
    const comments = await response.json();

    const postIds = comments.map((c: any) => c.postId);
    const uniquePostIds = [...new Set(postIds)];
    expect(uniquePostIds).toContain(1);
    expect(uniquePostIds).toContain(100);
  });

  test("GET /comments → corpos de texto > 10 caracteres", async ({
    request,
  }) => {
    const response = await request.get("/comments");
    const comments = await response.json();

    comments.forEach((comment: any) => {
      expect(comment.body.length).toBeGreaterThan(10);
    });
  });

  test("GET /comments?postId=1 → filtrar comentários por post", async ({
    request,
  }) => {
    const response = await request.get("/comments?postId=1");
    expect(response.status()).toBe(200);

    const comments = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    comments.forEach((comment: any) => {
      expect(comment.postId).toBe(1);
    });
  });

  test("GET /comments → nomes não vazios", async ({ request }) => {
    const response = await request.get("/comments");
    const comments = await response.json();

    comments.forEach((comment: any) => {
      expect(comment.name).not.toBe("");
      expect(comment.name).not.toBeNull();
      expect(comment.name).not.toBeUndefined();
    });
  });

  test("GET /comments → IDs sequenciais de 1 a 500", async ({ request }) => {
    const response = await request.get("/comments");
    const comments = await response.json();

    comments.forEach((comment: any, index: number) => {
      expect(comment.id).toBe(index + 1);
    });

    expect(comments[0].id).toBe(1); // ✅ Primeiro elemento (índice 0)
    expect(comments[499].id).toBe(500); // ✅ Último elemento (índice 499)
  });
});
