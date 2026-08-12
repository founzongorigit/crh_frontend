import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  Paiement,
  PaiementCreatePayload,
  PaiementFilters,
  PaiementUpdatePayload,
} from '@/types/paiement'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

const toPaiementFormData = (payload: PaiementCreatePayload | PaiementUpdatePayload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value instanceof File ? value : String(value))
  })

  return formData
}

export const usePaiementStore = defineStore('paiement', () => {
  const paiements = ref<Paiement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPaiements = async (params?: PaiementFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Paiement[]>('/paiements/', { params })
      paiements.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les paiements')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPaiement = async (payload: PaiementCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<Paiement>('/paiements/', toPaiementFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      paiements.value = [data, ...paiements.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer le paiement')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePaiement = async (id: string, payload: PaiementUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<Paiement>(`/paiements/${id}`, toPaiementFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      paiements.value = paiements.value.map((paiement) => (paiement.id === id ? data : paiement))
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier le paiement')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePaiement = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/paiements/${id}`)
      paiements.value = paiements.value.filter((paiement) => paiement.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer le paiement')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    paiements,
    loading,
    error,
    fetchPaiements,
    createPaiement,
    updatePaiement,
    deletePaiement,
  }
})
