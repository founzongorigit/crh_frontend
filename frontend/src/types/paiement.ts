export type TypeReglement = 'PARTIEL' | 'TOTAL'

export interface Paiement {
  id: string
  projet_id: string
  projet_libelle: string
  prestataire_id: string
  prestataire_nom: string
  montant: number | string
  type_reglement: TypeReglement
  date_paiement: string
  validation_daf_id: string
  reference_mandatement: string | null
  justificatif: string | null
  created_at: string
  updated_at: string
}

export interface PaiementFilters {
  projet_id?: string
  prestataire_id?: string
}

export interface PaiementCreatePayload {
  projet_id: string
  prestataire_id: string
  montant: number | string
  type_reglement: TypeReglement
  date_paiement: string
  validation_daf_id: string
  reference_mandatement?: string | null
  justificatif?: File | null
}

export interface PaiementUpdatePayload {
  projet_id?: string
  prestataire_id?: string
  montant?: number | string
  type_reglement?: TypeReglement
  date_paiement?: string
  validation_daf_id?: string
  reference_mandatement?: string | null
  justificatif?: File | null
}
