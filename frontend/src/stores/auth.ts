import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, LoginCredentials, AuthResponse, ErrorResponse, UserProfileUpdatePayload } from '@/types/user'
import axios, { type AxiosError } from 'axios'

const toProfileFormData = (payload: UserProfileUpdatePayload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value instanceof File ? value : String(value))
  })

  return formData
}

export const useAuthStore = defineStore('auth', () => {
  const   user = ref<User | null>(null) // Utilisateur connecté
  const isAuthenticated = computed(() => !!user.value)
  const loading = ref(false) // Indique si une requête est en cours
  const error = ref<string | null>(null) // Message d'erreur

  /** Réinitialise l’état client sans appeler l’API (utilisé sur 401 global). */
  const clearSession = () => {
    user.value = null
  }

  /**
   * Restaure l’utilisateur à partir du cookie JWT (après F5 ou entrée directe sur une URL).
   */
  const fetchSession = async () => {
    try {
      const { data } = await api.get<User>('/auth/me')
      user.value = data
    } catch {
      try {
        await api.post('/auth/refresh')
        const { data } = await api.get<User>('/auth/me')
        user.value = data
      } catch {
        user.value = null
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    loading.value = true // Démarre la requête
    error.value = null // Réinitialise l'erreur
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials)
      user.value = data.user // Sauvegarde l'utilisateur connecté
      return data
    } catch (err) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        // TypeScript sait avec certitude que 'err' possède la structure Axios
        error.value = err.response?.data?.error || err.message;
      } else {
        // Cas très rare où l'erreur vient du code JS local et non d'une requête HTTP
        error.value = 'Erreur de connexion';
      }
      throw err;
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (payload: UserProfileUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<User>('/users/me', toProfileFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      user.value = data
      return data
    } catch (err) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        error.value = err.response?.data?.error || err.response?.data?.detail || err.message
      } else {
        error.value = 'Erreur lors de la modification du profil'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    try {
      await api.post('/auth/logout')
    } catch (err) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        error.value = err.response?.data?.error || err.message
      } else {
        error.value = 'Erreur de déconnexion'
      }
    } finally {
      user.value = null
    }
  }

  return { user, isAuthenticated, loading, error, login, updateProfile, logout, fetchSession, clearSession }
})
