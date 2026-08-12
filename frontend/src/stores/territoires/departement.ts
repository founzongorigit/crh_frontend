import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type { ErrorResponse } from '@/types/user'
import type {
  Departement,
  DepartementCreatePayload,
  DepartementFilters,
  DepartementUpdatePayload,
} from '@/types/territoires/departement'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useDepartementStore = defineStore('departements', () => {
  const departements = ref<Departement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDepartements = async (params?: DepartementFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Departement[]>('/territoires/departements', { params })
      departements.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les départements')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDepartement = async (payload: DepartementCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<Departement>('/territoires/departements', payload)
      departements.value = [data, ...departements.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer le département')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDepartement = async (id: string, payload: DepartementUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<Departement>(`/territoires/departements/${id}`, payload)
      departements.value = departements.value.map((departement) =>
        departement.id === id ? data : departement,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier le département')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDepartementStatus = async (id: string, isActive: boolean) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.patch<Departement>(`/territoires/departements/${id}/status`, {
        is_active: isActive,
      })
      departements.value = departements.value.map((departement) =>
        departement.id === id ? data : departement,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de changer le statut du département')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDepartement = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/territoires/departements/${id}`)
      departements.value = departements.value.filter((departement) => departement.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer le département')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    departements,
    loading,
    error,
    fetchDepartements,
    createDepartement,
    updateDepartement,
    updateDepartementStatus,
    deleteDepartement,
  }
})
