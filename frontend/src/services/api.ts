import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = API_BASE_URL

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Pour les cookies JWT
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getBackendFileUrl = (fileUrl?: string | null) => {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl

  const apiBaseUrl = new URL(BASE_URL)
  const normalizedFileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`

  return `${apiBaseUrl.origin}${normalizedFileUrl}`
}

// Intercepteur pour rafraîchir automatiquement le token expiré.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const requestUrl = originalRequest?.url ?? ''
    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/me') ||
      requestUrl.includes('/auth/refresh')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh')
        return api(originalRequest)
      } catch {
        const authStore = useAuthStore()
        authStore.clearSession()
      }
    }

    if (error.response?.status === 401 && !isAuthRequest) {
      const authStore = useAuthStore()
      authStore.clearSession()
    }

    return Promise.reject(error)
  }
)

export default api
