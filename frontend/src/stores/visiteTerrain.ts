import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  VisiteTerrain,
  VisiteTerrainCreatePayload,
  VisiteTerrainFilters,
  VisiteTerrainUpdatePayload,
} from '@/types/visiteTerrain'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

const toVisiteTerrainFormData = (payload: VisiteTerrainCreatePayload | VisiteTerrainUpdatePayload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value instanceof File ? value : String(value))
  })

  return formData
}

export const useVisiteTerrainStore = defineStore('visiteTerrain', () => {
  const visitesTerrain = ref<VisiteTerrain[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchVisitesTerrain = async (params?: VisiteTerrainFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<VisiteTerrain[]>('/visite-terrain/', { params })
      visitesTerrain.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les visites terrain')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createVisiteTerrain = async (payload: VisiteTerrainCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<VisiteTerrain>(
        '/visite-terrain/',
        toVisiteTerrainFormData(payload),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      visitesTerrain.value = [data, ...visitesTerrain.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer la visite terrain')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVisiteTerrain = async (id: string, payload: VisiteTerrainUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<VisiteTerrain>(
        `/visite-terrain/${id}`,
        toVisiteTerrainFormData(payload),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      visitesTerrain.value = visitesTerrain.value.map((visite) =>
        visite.id === id ? data : visite,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier la visite terrain')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVisiteTerrain = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/visite-terrain/${id}`)
      visitesTerrain.value = visitesTerrain.value.filter((visite) => visite.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer la visite terrain')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    visitesTerrain,
    loading,
    error,
    fetchVisitesTerrain,
    createVisiteTerrain,
    updateVisiteTerrain,
    deleteVisiteTerrain,
  }
})
