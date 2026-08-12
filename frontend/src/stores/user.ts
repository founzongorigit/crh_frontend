import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type { ErrorResponse, User, UserCreatePayload, UserUpdatePayload } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

const toUserFormData = (payload: UserCreatePayload | UserUpdatePayload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(item)))
      return
    }

    formData.append(key, value instanceof File ? value : String(value))
  })

  return formData
}

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<User[]>('/users/')
      users.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les utilisateurs')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload: UserCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<User>('/users/', toUserFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      users.value = [data, ...users.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de créer l'utilisateur")
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: string, payload: UserUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<User>(`/users/${id}`, toUserFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      users.value = users.value.map((user) => (user.id === id ? data : user))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de modifier l'utilisateur")
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUserStatus = async (id: string, isActive: boolean) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.patch<User>(`/users/${id}/status`, { is_active: isActive })
      users.value = users.value.map((user) => (user.id === id ? data : user))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de changer le statut de l'utilisateur")
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/users/${id}`)
      users.value = users.value.filter((user) => user.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de supprimer l'utilisateur")
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
  }
})
