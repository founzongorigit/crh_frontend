import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  TypeIntervention,
  TypeInterventionCreatePayload,
  TypeInterventionFilters,
  TypeInterventionUpdatePayload,
} from '@/types/typeIntervention'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useTypeInterventionStore = defineStore('typeIntervention', () => {
  const typesIntervention = ref<TypeIntervention[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTypesIntervention = async (params?: TypeInterventionFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<TypeIntervention[]>('/type-interventions/', { params })
      typesIntervention.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de charger les types d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTypeIntervention = async (payload: TypeInterventionCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<TypeIntervention>('/type-interventions/', payload)
      typesIntervention.value = [data, ...typesIntervention.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de créer le type d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTypeIntervention = async (id: string, payload: TypeInterventionUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<TypeIntervention>(`/type-interventions/${id}`, payload)
      typesIntervention.value = typesIntervention.value.map((typeIntervention) =>
        typeIntervention.id === id ? data : typeIntervention,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de modifier le type d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTypeIntervention = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/type-interventions/${id}`)
      typesIntervention.value = typesIntervention.value.filter(
        (typeIntervention) => typeIntervention.id !== id,
      )
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de supprimer le type d'intervention")
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    typesIntervention,
    loading,
    error,
    fetchTypesIntervention,
    createTypeIntervention,
    updateTypeIntervention,
    deleteTypeIntervention,
  }
})
