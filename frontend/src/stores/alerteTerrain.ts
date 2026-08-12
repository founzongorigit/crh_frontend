import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  AlerteTerrain,
  AlerteTerrainCreatePayload,
  AlerteTerrainFilters,
  AlerteTerrainUpdatePayload,
} from '@/types/alerteTerrain'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useAlerteTerrainStore = defineStore('alerteTerrain', () => {
  const alertesTerrain = ref<AlerteTerrain[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAlertesTerrain = async (params?: AlerteTerrainFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<AlerteTerrain[]>('/alerte-terrain/', { params })
      alertesTerrain.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les alertes terrain')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createAlerteTerrain = async (payload: AlerteTerrainCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<AlerteTerrain>('/alerte-terrain/', payload)
      alertesTerrain.value = [data, ...alertesTerrain.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de créer l'alerte terrain")
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAlerteTerrain = async (id: string, payload: AlerteTerrainUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<AlerteTerrain>(`/alerte-terrain/${id}`, payload)
      alertesTerrain.value = alertesTerrain.value.map((alerte) =>
        alerte.id === id ? data : alerte,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de modifier l'alerte terrain")
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAlerteTerrain = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/alerte-terrain/${id}`)
      alertesTerrain.value = alertesTerrain.value.filter((alerte) => alerte.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de supprimer l'alerte terrain")
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    alertesTerrain,
    loading,
    error,
    fetchAlertesTerrain,
    createAlerteTerrain,
    updateAlerteTerrain,
    deleteAlerteTerrain,
  }
})
