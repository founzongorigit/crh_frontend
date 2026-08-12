export type TypeLocalite = 'village' | 'campement' | 'ville' | 'canton' | 'autre'

export interface Localite {
  id: string
  nom: string
  type: TypeLocalite
  sous_prefecture_id: string
  departement_id: string
  latitude: number | string | null
  longitude: number | string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LocaliteFilters {
  departement_id?: string
  sous_prefecture_id?: string
}

export interface LocaliteCreatePayload {
  nom: string
  type: TypeLocalite
  sous_prefecture_id: string
  latitude?: number | string | null
  longitude?: number | string | null
}

export interface LocaliteUpdatePayload {
  nom?: string
  type?: TypeLocalite
  sous_prefecture_id?: string
  latitude?: number | string | null
  longitude?: number | string | null
  is_active?: boolean
}

export interface LocaliteImportError {
  row: number
  error: string
}

export interface LocaliteImportResult {
  created: number
  errors: LocaliteImportError[]
}
