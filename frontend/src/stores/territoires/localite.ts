import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type { ErrorResponse } from '@/types/user'
import type {
  Localite,
  LocaliteCreatePayload,
  LocaliteFilters,
  LocaliteImportResult,
  LocaliteUpdatePayload,
} from '@/types/territoires/localite'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useLocaliteStore = defineStore('localites', () => {
  const localites = ref<Localite[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchLocalites = async (params?: LocaliteFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Localite[]>('/territoires/localites', { params })
      localites.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les localités')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createLocalite = async (payload: LocaliteCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<Localite>('/territoires/localites', payload)
      localites.value = [data, ...localites.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer la localité')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateLocalite = async (id: string, payload: LocaliteUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<Localite>(`/territoires/localites/${id}`, payload)
      localites.value = localites.value.map((localite) => (localite.id === id ? data : localite))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier la localité')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateLocaliteStatus = async (id: string, isActive: boolean) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.patch<Localite>(`/territoires/localites/${id}/status`, {
        is_active: isActive,
      })
      localites.value = localites.value.map((localite) => (localite.id === id ? data : localite))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de changer le statut de la localité')
      throw err
    } finally {
      loading.value = false
    }
  }

  const importLocalitesCsv = async (file: File) => {
    loading.value = true
    error.value = null

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await api.post<LocaliteImportResult>(
        '/territoires/localites/import-csv',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      await fetchLocalites()
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible d'importer les localités")
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteLocalite = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/territoires/localites/${id}`)
      localites.value = localites.value.filter((localite) => localite.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer la localité')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    localites,
    loading,
    error,
    fetchLocalites,
    createLocalite,
    updateLocalite,
    updateLocaliteStatus,
    importLocalitesCsv,
    deleteLocalite,
  }
})
