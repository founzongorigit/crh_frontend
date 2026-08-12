export interface DomaineIntervention {
  id: string
  nom: string
  code_comptable: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface DomaineInterventionCreatePayload {
  nom: string
  code_comptable: string
  description?: string | null
}

export interface DomaineInterventionUpdatePayload {
  nom?: string
  code_comptable?: string
  description?: string | null
}
