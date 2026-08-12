import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  ProjetLocalite,
  ProjetLocaliteCreatePayload,
  ProjetLocaliteFilters,
  ProjetLocaliteUpdatePayload,
} from '@/types/projetLocalite'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useProjetLocaliteStore = defineStore('projetLocalite', () => {
  const projetLocalites = ref<ProjetLocalite[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllProjetLocalites = async (params?: ProjetLocaliteFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<ProjetLocalite[]>('/projet-localites/', { params })
      projetLocalites.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les localités des projets')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProjetLocalite = async (payload: ProjetLocaliteCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<ProjetLocalite>('/projet-localites/', payload)
      projetLocalites.value = [data, ...projetLocalites.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer la localité du projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProjetLocalite = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/projet-localites/${id}`)
      projetLocalites.value = projetLocalites.value.filter((item) => item.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de retirer la localité du projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProjetLocalite = async (id: string, payload: ProjetLocaliteUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<ProjetLocalite>(`/projet-localites/${id}`, payload)
      projetLocalites.value = projetLocalites.value.map((item) => (item.id === id ? data : item))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier la localité du projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    projetLocalites,
    loading,
    error,
    fetchAllProjetLocalites,
    createProjetLocalite,
    updateProjetLocalite,
    deleteProjetLocalite,
  }
})
