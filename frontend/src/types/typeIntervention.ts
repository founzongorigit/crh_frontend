export interface TypeIntervention {
  id: string
  nom: string
  domaine_id: string
  domaine_nom: string
  description: string | null
  code_comptable: string | null
  created_at: string
  updated_at: string
}

export interface TypeInterventionCreatePayload {
  nom: string
  domaine_id: string
  description?: string | null
  code_comptable?: string | null
}

export interface TypeInterventionUpdatePayload {
  nom?: string
  domaine_id?: string
  description?: string | null
  code_comptable?: string | null
}

export interface TypeInterventionFilters {
  domaine_id?: string
}
