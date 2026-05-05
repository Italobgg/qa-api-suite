import { APIRequestContext } from '@playwright/test';

/**
 * 🛠️ API Helper — funções reutilizáveis para testes da JSONPlaceholder
 */
export function createApiHelper(request: APIRequestContext) {
  return {
    // 👥 Users
    getUsers: () => request.get('/users'),
    getUser: (id: number) => request.get(`/users/${id}`),

    // 📝 Posts
    getPosts: (_expectedCount?: number) => request.get('/posts'),
    getPost: (id: number) => request.get(`/posts/${id}`),
    createPost: (data: object) => request.post('/posts', { data }),
    updatePost: (id: number, data: object) => request.put(`/posts/${id}`, { data }),
    deletePost: (id: number) => request.delete(`/posts/${id}`),

    // 💬 Comments
    getComments: () => request.get('/comments'),
    getComment: (id: number) => request.get(`/comments/${id}`),
    getCommentsByPost: (postId: number) => request.get(`/comments?postId=${postId}`),
  };
}

// ✅ Validador de email reutilizável
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ Fixtures (dados de teste)
export const fakePost = {
  title: 'QA Automation Test',
  body: 'Post criado via Playwright',
  userId: 1,
};

export const fakeComment = {
  postId: 1,
  name: 'QA Test Comment',
  email: 'qa@test.com',
  body: 'Comentário automatizado',
};
