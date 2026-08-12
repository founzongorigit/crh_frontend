export type StatutValidation = 'EN_ATTENTE' | 'APPROUVE' | 'REJETE'

export type NiveauValidation = 1 | 2 | 3 | 4

export interface Validation {
  id: string
  projet_id: string
  projet_libelle: string
  validateur_id: string
  validateur_email: string
  niveau: NiveauValidation
  statut: StatutValidation
  note_sur_20: number | string | null
  commentaire: string | null
  date_validation: string | null
  pj_url: string | null
  paiement_autorise: boolean
  can_traiter: boolean
  created_at: string
  updated_at: string
}

export interface ValidationFilters {
  projet_id?: string
  validateur_id?: string
  niveau?: NiveauValidation
  statut?: StatutValidation
}

export interface ValidationCreatePayload {
  projet_id: string
  niveau: NiveauValidation
  statut?: StatutValidation
  note_sur_20?: number | string | null
  commentaire?: string | null
  piece_jointe?: File | null
}

export interface ValidationUpdatePayload {
  statut?: StatutValidation
  note_sur_20?: number | string | null
  commentaire?: string | null
  piece_jointe?: File | null
}
