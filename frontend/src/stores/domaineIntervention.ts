import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  DomaineIntervention,
  DomaineInterventionCreatePayload,
  DomaineInterventionUpdatePayload,
} from '@/types/domaineIntervention'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useDomaineInterventionStore = defineStore('domaineIntervention', () => {
  const domainesIntervention = ref<DomaineIntervention[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDomainesIntervention = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<DomaineIntervention[]>('/domaine-interventions/')
      domainesIntervention.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de charger les domaines d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDomaineIntervention = async (payload: DomaineInterventionCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<DomaineIntervention>('/domaine-interventions/', payload)
      domainesIntervention.value = [data, ...domainesIntervention.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de créer le domaine d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDomaineIntervention = async (
    id: string,
    payload: DomaineInterventionUpdatePayload,
  ) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<DomaineIntervention>(`/domaine-interventions/${id}`, payload)
      domainesIntervention.value = domainesIntervention.value.map((domaine) =>
        domaine.id === id ? data : domaine,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de modifier le domaine d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDomaineIntervention = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/domaine-interventions/${id}`)
      domainesIntervention.value = domainesIntervention.value.filter((domaine) => domaine.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de supprimer le domaine d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    domainesIntervention,
    loading,
    error,
    fetchDomainesIntervention,
    createDomaineIntervention,
    updateDomaineIntervention,
    deleteDomaineIntervention,
  }
})
