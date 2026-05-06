import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Helper de requisições para a API JSONPlaceholder
 * Centraliza todas as chamadas HTTP do projeto
 */
export interface ApiHelper {
  // Posts
  getPosts: (limit?: number) => Promise<APIResponse>;
  getPostById: (id: number) => Promise<APIResponse>;
  createPost: (data: PostPayload) => Promise<APIResponse>;
  updatePost: (id: number, data: PostPayload) => Promise<APIResponse>;
  deletePost: (id: number) => Promise<APIResponse>;

  // Users
  getUsers: () => Promise<APIResponse>;
  getUserById: (id: number) => Promise<APIResponse>;

  // Comments
  getComments: (postId?: number) => Promise<APIResponse>;
}

export interface PostPayload {
  title: string;
  body: string;
  userId: number;
}

/**
 * Factory que cria um ApiHelper com o contexto de request fornecido
 * @param request - APIRequestContext do Playwright
 */
export function createApiHelper(request: APIRequestContext): ApiHelper {
  return {
    // ============ POSTS ============
    getPosts: (limit = 100) => request.get(`/posts?_limit=${limit}`),

    getPostById: (id: number) => request.get(`/posts/${id}`),

    createPost: (data: PostPayload) =>
      request.post('/posts', { data }),

    updatePost: (id: number, data: PostPayload) =>
      request.put(`/posts/${id}`, { data }),

    deletePost: (id: number) => request.delete(`/posts/${id}`),

    // ============ USERS ============
    getUsers: () => request.get('/users'),

    getUserById: (id: number) => request.get(`/users/${id}`),

    // ============ COMMENTS ============
    getComments: (postId?: number) => {
      const url = postId ? `/comments?postId=${postId}` : '/comments';
      return request.get(url);
    },
  };
}
