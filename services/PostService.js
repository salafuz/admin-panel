import IPostService from "./interfaces/IPostService";
import ApiService from "./ApiService";

class PostService extends IPostService {
  constructor() {
    super();
  }

  async getPosts(page = 1, limit = 10) {
    try {
      const data = await ApiService.get("/posts", {
        params: { page, limit }
      });
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch posts");
    }
  }

  async getPost(id) {
    try {
      const data = await ApiService.get(`/posts/${id}`);
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch post");
    }
  }

  async getDeletedPosts() {
    try {
      const data = await ApiService.get("/posts/deleted");
      return { data };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch deleted posts");
    }
  }

  async createPost(post) {
    try {
      const data = await ApiService.post("/posts", post);
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to create post");
    }
  }

  async updatePost(id, post) {
    try {
      const data = await ApiService.put(`/posts/${id}`, post);
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to update post");
    }
  }

  async softDelete(id) {
    try {
      await ApiService.delete(`/posts/remove/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.message || "Failed to delete post");
    }
  }

  async restore(id) {
    try {
      await ApiService.post(`/posts/restore/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.message || "Failed to restore post");
    }
  }

  async forceDelete(id) {
    try {
      await ApiService.delete(`/posts/delete/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.message || "Failed to permanently delete post");
    }
  }
}

export default new PostService();
