export interface SousPrefecture {
  id: string
  nom: string
  departement_id: string
  chef_lieu_id: string | null
  sous_prefet_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SousPrefectureFilters {
  departement_id?: string
}

export interface SousPrefectureCreatePayload {
  nom: string
  departement_id: string
  chef_lieu_id?: string | null
  sous_prefet_id?: string | null
}

export interface SousPrefectureUpdatePayload {
  nom?: string
  departement_id?: string
  chef_lieu_id?: string | null
  sous_prefet_id?: string | null
  is_active?: boolean
}
