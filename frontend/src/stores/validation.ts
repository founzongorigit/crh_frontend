import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'
import type {
  Validation,
  ValidationCreatePayload,
  ValidationFilters,
  ValidationUpdatePayload,
} from '@/types/validation'
import type { ErrorResponse } from '@/types/user'

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    return err.response?.data?.error || err.response?.data?.detail || err.message
  }

  return fallback
}

const toValidationFormData = (payload: ValidationCreatePayload | ValidationUpdatePayload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value instanceof File ? value : String(value))
  })

  return formData
}

export const useValidationStore = defineStore('validation', () => {
  const validations = ref<Validation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchValidations = async (params?: ValidationFilters) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get<Validation[]>('/validations/', { params })
      validations.value = data
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de charger les validations')
      throw err
    } finally {
      loading.value = false
    }
  }

  // const createValidation = async (payload: ValidationCreatePayload) => {
  //   loading.value = true
  //   error.value = null

  //   try {
  //     const { data } = await api.post<Validation>('/validations/', toValidationFormData(payload), {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     })
  //     validations.value = [data, ...validations.value]
  //     return data
  //   } catch (err) {
  //     error.value = getErrorMessage(err, 'Impossible de créer la validation')
  //     throw err
  //   } finally {
  //     loading.value = false
  //   }
  // }

  const updateValidation = async (id: string, payload: ValidationUpdatePayload) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put<Validation>(`/validations/${id}`, toValidationFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      validations.value = validations.value.map((validation) =>
        validation.id === id ? data : validation,
      )
      return data
    } catch (err) {
      error.value = getErrorMessage(err, 'Impossible de modifier la validation')
      throw err
    } finally {
      loading.value = false
    }
  }

  // const deleteValidation = async (id: string) => {
  //   loading.value = true
  //   error.value = null

  //   try {
  //     await api.delete(`/validations/${id}`)
  //     validations.value = validations.value.filter((validation) => validation.id !== id)
  //   } catch (err) {
  //     error.value = getErrorMessage(err, 'Impossible de supprimer la validation')
  //     throw err
  //   } finally {
  //     loading.value = false
  //   }
  // }

  return {
    validations,
    loading,
    error,
    fetchValidations,
    // createValidation,
    updateValidation,
    // deleteValidation,
  }
})
