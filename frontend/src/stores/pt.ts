import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  ProgrammeTriennal,
  ProgrammeTriennalCreatePayload,
  ProgrammeTriennalFilters,
  ProgrammeTriennalImportResult,
  ProgrammeTriennalUpdatePayload,
} from '@/types/pt'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const usePtStore = defineStore('pt', () => {
  const programmes = ref<ProgrammeTriennal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProgrammes = async (params?: ProgrammeTriennalFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<ProgrammeTriennal[]>('/pt/', { params })
      programmes.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les programmes triennaux')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProgramme = async (payload: ProgrammeTriennalCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<ProgrammeTriennal>('/pt/', payload)
      programmes.value = [data, ...programmes.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer le programme triennal')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProgramme = async (id: string, payload: ProgrammeTriennalUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<ProgrammeTriennal>(`/pt/${id}`, payload)
      programmes.value = programmes.value.map((programme) =>
        programme.id === id ? data : programme,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier le programme triennal')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProgramme = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/pt/${id}`)
      programmes.value = programmes.value.filter((programme) => programme.id !== id)
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer le programme triennal')
      throw err
    } finally {
      loading.value = false
    }
  }

  const importProgrammesExcel = async (file: File) => {
    loading.value = true
    error.value = null

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await api.post<ProgrammeTriennalImportResult>('/pt/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchProgrammes()
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible d'importer les programmes triennaux")
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    programmes,
    loading,
    error,
    fetchProgrammes,
    createProgramme,
    updateProgramme,
    deleteProgramme,
    importProgrammesExcel,
  }
})
