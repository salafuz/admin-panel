import { defineStore } from 'pinia'

interface Tag {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

interface ApiResponse {
  data: Tag[]
  total: number
}

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [] as Tag[],
    total: 0,
    loading: false,
    currentPage: 1,
    perPage: 10,
  }),

  getters: {
    getTags: (state) => state.tags,
    getTagById: (state) => (id: number) => state.tags.find((t) => t.id === id),
  },

  actions: {
    async fetchTags(params?: {
      search?: string
      page?: number
    }) {
      try {
        this.loading = true
        const response = await $fetch<ApiResponse>('/api/tags', {
          params: {
            page: params?.page || this.currentPage,
            per_page: this.perPage,
            search: params?.search,
          },
        })
        this.tags = response.data
        this.total = response.total
      } catch (error) {
        console.error('Failed to fetch tags:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTag(id: number) {
      try {
        this.loading = true
        const tag = await $fetch<Tag>(`/api/tags/${id}`)
        return tag
      } catch (error) {
        console.error(`Failed to fetch tag ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTag(data: Omit<Tag, 'id'>) {
      try {
        this.loading = true
        const tag = await $fetch<Tag>('/api/tags', {
          method: 'POST',
          body: data,
        })
        this.tags.unshift(tag)
        return tag
      } catch (error) {
        console.error('Failed to create tag:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTag(id: number, data: Partial<Omit<Tag, 'id'>>) {
      try {
        this.loading = true
        const tag = await $fetch<Tag>(`/api/tags/${id}`, {
          method: 'PUT',
          body: data,
        })
        const index = this.tags.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tags[index] = tag
        }
        return tag
      } catch (error) {
        console.error(`Failed to update tag ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTag(id: number) {
      try {
        this.loading = true
        await $fetch(`/api/tags/${id}`, {
          method: 'DELETE',
        })
        this.tags = this.tags.filter((t) => t.id !== id)
      } catch (error) {
        console.error(`Failed to delete tag ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    changePage(page: number) {
      this.currentPage = page
      this.fetchTags({ page })
    },
  },
})
