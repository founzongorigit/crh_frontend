import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  Prestataire,
  PrestataireCreatePayload,
  PrestataireUpdatePayload,
} from '@/types/prestataire'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const usePrestataireStore = defineStore('prestataire', () => {
  const prestataires = ref<Prestataire[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPrestataires = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Prestataire[]>('/prestataires/')
      prestataires.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les prestataires')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPrestataire = async (payload: PrestataireCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<Prestataire>('/prestataires/', payload)
      prestataires.value = [data, ...prestataires.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer le prestataire')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePrestataire = async (id: string, payload: PrestataireUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<Prestataire>(`/prestataires/${id}`, payload)
      prestataires.value = prestataires.value.map((prestataire) =>
        prestataire.id === id ? data : prestataire,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier le prestataire')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePrestataire = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/prestataires/${id}`)
      prestataires.value = prestataires.value.filter((prestataire) => prestataire.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer le prestataire')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    prestataires,
    loading,
    error,
    fetchPrestataires,
    createPrestataire,
    updatePrestataire,
    deletePrestataire,
  }
})
