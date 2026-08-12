import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type { ActivityLog, ActivityLogFilters } from '@/types/activityLog'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

export const useActivityLogStore = defineStore('activityLogs', () => {
  const activityLogs = ref<ActivityLog[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchActivityLogs = async (params?: ActivityLogFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<ActivityLog[]>('/users/activity-logs', { params })
      activityLogs.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, "Impossible de charger le journal d'activités")
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearActivityLogs = () => {
    activityLogs.value = []
    error.value = null
  }

  return {
    activityLogs,
    loading,
    error,
    fetchActivityLogs,
    clearActivityLogs,
  }
})
