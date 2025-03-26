import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

export interface LoginCredentials {
  login: string
  password: string
}

export const useAuth = () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const success = await authStore.login(credentials)
      if (success) {
        return true
      }
      return false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    login,
    loading,
    error,
  }
}
