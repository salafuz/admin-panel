/**
 * Interface for post management service
 */
export default class IPostService {
  getPosts(page = 1, limit = 10) {
    throw new Error('Method not implemented');
  }

  getPost(id) {
    throw new Error('Method not implemented');
  }

  getDeletedPosts() {
    throw new Error('Method not implemented');
  }

  createPost(post) {
    throw new Error('Method not implemented');
  }

  updatePost(id, post) {
    throw new Error('Method not implemented');
  }

  softDelete(id) {
    throw new Error('Method not implemented');
  }

  restore(id) {
    throw new Error('Method not implemented');
  }

  forceDelete(id) {
    throw new Error('Method not implemented');
  }
}
