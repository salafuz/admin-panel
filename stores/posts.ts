import { defineStore } from 'pinia'
import type { Post, PostInput } from '@/types/post'
import { useCategoriesStore } from './categories'
import { useTagsStore } from './tags'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    total: 0,
    loading: false,
    currentPage: 1,
    perPage: 10,
  }),

  getters: {
    getPosts: (state) => state.posts,
    getPostById: (state) => (id: number) => state.posts.find((p) => p.id === id),
    getPostTags: (state) => (id: number) => {
      const post = state.posts.find((p) => p.id === id)
      return post?.tags || []
    }
  },

  actions: {
    async fetchPosts(params?: {
      search?: string
      status?: string
      sort?: string
      direction?: 'asc' | 'desc'
      page?: number
    }) {
      try {
        this.loading = true
        const response = await $fetch('/api/posts', {
          params: {
            page: params?.page || this.currentPage,
            per_page: this.perPage,
            search: params?.search,
            status: params?.status,
            sort: params?.sort,
            direction: params?.direction,
          },
        })
        this.posts = response.data
        this.total = response.total
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPost(id: number) {
      try {
        this.loading = true
        const post = await $fetch(`/api/posts/${id}`)
        return post as Post
      } catch (error) {
        console.error(`Failed to fetch post ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPost(data: PostInput) {
      try {
        this.loading = true
        const post = await $fetch('/api/posts', {
          method: 'POST',
          body: data,
        })
        this.posts.unshift(post as Post)
        return post
      } catch (error) {
        console.error('Failed to create post:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePost(id: number, data: Partial<PostInput>) {
      try {
        this.loading = true
        const post = await $fetch(`/api/posts/${id}`, {
          method: 'PUT',
          body: data,
        })
        const index = this.posts.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.posts[index] = { ...this.posts[index], ...(post as Post) }
        }
        return post
      } catch (error) {
        console.error(`Failed to update post ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePost(id: number) {
      try {
        this.loading = true
        await $fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        })
        this.posts = this.posts.filter((p) => p.id !== id)
      } catch (error) {
        console.error(`Failed to delete post ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      const categoryStore = useCategoriesStore()
      await categoryStore.fetchCategories()
      return categoryStore.categories
    },

    async fetchTags() {
      const tagStore = useTagsStore()
      await tagStore.fetchTags()
      return tagStore.tags
    },

    async addTagToPost(postId: number, tagId: number) {
      try {
        this.loading = true
        await $fetch(`/api/posts/${postId}/tags`, {
          method: 'POST',
          body: { tag_id: tagId },
        })
        // Refresh the post to get updated tags
        await this.fetchPost(postId)
      } catch (error) {
        console.error(`Failed to add tag ${tagId} to post ${postId}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeTagFromPost(postId: number, tagId: number) {
      try {
        this.loading = true
        await $fetch(`/api/posts/${postId}/tags/${tagId}`, {
          method: 'DELETE',
        })
        // Refresh the post to get updated tags
        await this.fetchPost(postId)
      } catch (error) {
        console.error(`Failed to remove tag ${tagId} from post ${postId}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    changePage(page: number) {
      this.currentPage = page
      this.fetchPosts({ page })
    },
  },
})
