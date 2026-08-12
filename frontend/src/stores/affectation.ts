import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  AffectationConseillerLocalite,
  AffectationFilters,
  AffectationVPDepartement,
  ConseillerLocalitesPayload,
  VPDepartementsPayload,
} from '@/types/affectation'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useAffectationStore = defineStore('affectations', () => {
  const conseillerLocalites = ref<AffectationConseillerLocalite[]>([])
  const vpDepartements = ref<AffectationVPDepartement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchConseillerLocalites = async (params?: AffectationFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<AffectationConseillerLocalite[]>(
        '/affectations/conseillers',
        { params },
      )
      conseillerLocalites.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les affectations des conseillers')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateConseillerLocalites = async (
    userId: string,
    payload: ConseillerLocalitesPayload,
  ) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<AffectationConseillerLocalite[]>(
        `/affectations/conseillers/${userId}/localites`,
        payload,
      )
      conseillerLocalites.value = [
        ...conseillerLocalites.value.filter((affectation) => affectation.conseiller_id !== userId),
        ...data,
      ]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de modifier les localités du conseiller")
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchVPDepartements = async (params?: AffectationFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<AffectationVPDepartement[]>('/affectations/vp', { params })
      vpDepartements.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les affectations des VP')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVPDepartements = async (userId: string, payload: VPDepartementsPayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<AffectationVPDepartement[]>(
        `/affectations/vp/${userId}/departements`,
        payload,
      )
      vpDepartements.value = [
        ...vpDepartements.value.filter((affectation) => affectation.vice_president_id !== userId),
        ...data,
      ]
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier les départements du VP')
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAffectations = async (params?: AffectationFilters) => {
    const [conseillers, vp] = await Promise.all([
      fetchConseillerLocalites(params),
      fetchVPDepartements(params),
    ])

    return { conseillers, vp }
  }

  return {
    conseillerLocalites,
    vpDepartements,
    loading,
    error,
    fetchAffectations,
    fetchConseillerLocalites,
    updateConseillerLocalites,
    fetchVPDepartements,
    updateVPDepartements,
  }
})
