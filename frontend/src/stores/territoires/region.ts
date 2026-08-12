import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type { ErrorResponse } from '@/types/user'
import type { Region, RegionCreatePayload, RegionUpdatePayload } from '@/types/territoires/region'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useRegionStore = defineStore('regions', () => {
  const regions = ref<Region[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRegions = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Region[]>('/territoires/regions')
      regions.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les régions')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRegion = async (payload: RegionCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<Region>('/territoires/regions', payload)
      regions.value = [data, ...regions.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer la région')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRegion = async (id: string, payload: RegionUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<Region>(`/territoires/regions/${id}`, payload)
      regions.value = regions.value.map((region) => (region.id === id ? data : region))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier la région')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRegionStatus = async (id: string, isActive: boolean) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.patch<Region>(`/territoires/regions/${id}/status`, {
        is_active: isActive,
      })
      regions.value = regions.value.map((region) => (region.id === id ? data : region))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de changer le statut de la région')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRegion = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/territoires/regions/${id}`)
      regions.value = regions.value.filter((region) => region.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer la région')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    regions,
    loading,
    error,
    fetchRegions,
    createRegion,
    updateRegion,
    updateRegionStatus,
    deleteRegion,
  }
})
