import { defineStore } from 'pinia'

interface Category {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

interface ApiResponse {
  data: Category[]
  total: number
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    total: 0,
    loading: false,
    currentPage: 1,
    perPage: 10,
  }),

  getters: {
    getCategories: (state) => state.categories,
    getCategoryById: (state) => (id: number) => state.categories.find((c) => c.id === id),
  },

  actions: {
    async fetchCategories(params?: {
      search?: string
      page?: number
    }) {
      try {
        this.loading = true
        const response = await $fetch<ApiResponse>('/api/categories', {
          params: {
            page: params?.page || this.currentPage,
            per_page: this.perPage,
            search: params?.search,
          },
        })
        this.categories = response.data
        this.total = response.total
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategory(id: number) {
      try {
        this.loading = true
        const category = await $fetch<Category>(`/api/categories/${id}`)
        return category
      } catch (error) {
        console.error(`Failed to fetch category ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCategory(data: Omit<Category, 'id'>) {
      try {
        this.loading = true
        const category = await $fetch<Category>('/api/categories', {
          method: 'POST',
          body: data,
        })
        this.categories.unshift(category)
        return category
      } catch (error) {
        console.error('Failed to create category:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id: number, data: Partial<Omit<Category, 'id'>>) {
      try {
        this.loading = true
        const category = await $fetch<Category>(`/api/categories/${id}`, {
          method: 'PUT',
          body: data,
        })
        const index = this.categories.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.categories[index] = category
        }
        return category
      } catch (error) {
        console.error(`Failed to update category ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id: number) {
      try {
        this.loading = true
        await $fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        })
        this.categories = this.categories.filter((c) => c.id !== id)
      } catch (error) {
        console.error(`Failed to delete category ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    changePage(page: number) {
      this.currentPage = page
      this.fetchCategories({ page })
    },
  },
})
