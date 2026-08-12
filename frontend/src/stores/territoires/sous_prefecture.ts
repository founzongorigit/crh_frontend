import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type { ErrorResponse } from '@/types/user'
import type {
  SousPrefecture,
  SousPrefectureCreatePayload,
  SousPrefectureFilters,
  SousPrefectureUpdatePayload,
} from '@/types/territoires/sous_prefecture'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useSousPrefectureStore = defineStore('sous-prefectures', () => {
  const sousPrefectures = ref<SousPrefecture[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSousPrefectures = async (params?: SousPrefectureFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<SousPrefecture[]>('/territoires/sous-prefectures', { params })
      sousPrefectures.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les sous-préfectures')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createSousPrefecture = async (payload: SousPrefectureCreatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post<SousPrefecture>('/territoires/sous-prefectures', payload)
      sousPrefectures.value = [data, ...sousPrefectures.value]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de créer la sous-préfecture')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSousPrefecture = async (id: string, payload: SousPrefectureUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<SousPrefecture>(`/territoires/sous-prefectures/${id}`, payload)
      sousPrefectures.value = sousPrefectures.value.map((sousPrefecture) =>
        sousPrefecture.id === id ? data : sousPrefecture,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier la sous-préfecture')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSousPrefectureStatus = async (id: string, isActive: boolean) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.patch<SousPrefecture>(
        `/territoires/sous-prefectures/${id}/status`,
        { is_active: isActive },
      )
      sousPrefectures.value = sousPrefectures.value.map((sousPrefecture) =>
        sousPrefecture.id === id ? data : sousPrefecture,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de changer le statut de la sous-préfecture')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSousPrefecture = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/territoires/sous-prefectures/${id}`)
      sousPrefectures.value = sousPrefectures.value.filter(
        (sousPrefecture) => sousPrefecture.id !== id,
      )
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de supprimer la sous-préfecture')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    sousPrefectures,
    loading,
    error,
    fetchSousPrefectures,
    createSousPrefecture,
    updateSousPrefecture,
    updateSousPrefectureStatus,
    deleteSousPrefecture,
  }
})
