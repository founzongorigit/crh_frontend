import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  CahierCharges,
  CahierChargesCreatePayload,
  CahierChargesFilters,
  CahierChargesUpdatePayload,
} from '@/types/cahierCharges'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

const toCahierChargesFormData = (payload: CahierChargesCreatePayload | CahierChargesUpdatePayload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value instanceof File ? value : String(value))
  })

  return formData
}

export const useCahierChargesStore = defineStore('cahierCharges', () => {
  const cahiersCharges = ref<CahierCharges[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCahiersCharges = async (params?: CahierChargesFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<CahierCharges[]>('/cahier-charges/', { params })
      cahiersCharges.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les cahiers des charges')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCahierCharges = async (payload: CahierChargesCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<CahierCharges>(
        '/cahier-charges/',
        toCahierChargesFormData(payload),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      cahiersCharges.value = [data, ...cahiersCharges.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer le cahier des charges')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCahierCharges = async (id: string, payload: CahierChargesUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<CahierCharges>(
        `/cahier-charges/${id}`,
        toCahierChargesFormData(payload),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      cahiersCharges.value = cahiersCharges.value.map((cahier) =>
        cahier.id === id ? data : cahier,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier le cahier des charges')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCahierCharges = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/cahier-charges/${id}`)
      cahiersCharges.value = cahiersCharges.value.filter((cahier) => cahier.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer le cahier des charges')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    cahiersCharges,
    loading,
    error,
    fetchCahiersCharges,
    createCahierCharges,
    updateCahierCharges,
    deleteCahierCharges,
  }
})
