import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  Projet,
  ProjetCreatePayload,
  ProjetDetail,
  ProjetFilters,
  ProjetUpdatePayload,
} from '@/types/projet'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useProjetStore = defineStore('projet', () => {
  const projets = ref<Projet[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjets = async (params?: ProjetFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Projet[]>('/projets/', { params })
      projets.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les projets')
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProjet = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<ProjetDetail>(`/projets/${id}`)
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger le projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProjet = async (payload: ProjetCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<ProjetDetail>('/projets/', payload)
      projets.value = [data, ...projets.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer le projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProjet = async (id: string, payload: ProjetUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<ProjetDetail>(`/projets/${id}`, payload)
      projets.value = projets.value.map((projet) => (projet.id === id ? data : projet))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier le projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  

  const deleteProjet = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/projets/${id}`)
      projets.value = projets.value.filter((projet) => projet.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer le projet')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    projets,
    loading,
    error,
    fetchProjets,
    fetchProjet,
    createProjet,
    updateProjet,
    deleteProjet,
  }
})
