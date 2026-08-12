export interface CahierCharges {
  id: string
  type_intervention_id: string
  type_intervention_nom: string
  fichier_pdf: string | null
  version: string
  date_upload: string | null
  actif: boolean
  created_at: string
  updated_at: string
}

export interface CahierChargesCreatePayload {
  type_intervention_id: string
  fichier_pdf?: File | null
  version?: string
  date_upload?: string | null
  actif?: boolean
}

export interface CahierChargesUpdatePayload {
  type_intervention_id?: string
  fichier_pdf?: File | null
  version?: string
  date_upload?: string | null
  actif?: boolean
}

export interface CahierChargesFilters {
  type_intervention_id?: string
  actif?: boolean
}
