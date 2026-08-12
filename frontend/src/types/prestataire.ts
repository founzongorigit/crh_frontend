export interface Prestataire {
  id: string
  raison_sociale: string
  num_id_fiscal: string | null
  siege: string | null
  telephone: string | null
  email: string | null
  representant: string | null
  created_at: string
  updated_at: string
}

export interface PrestataireCreatePayload {
  raison_sociale: string
  num_id_fiscal?: string | null
  siege?: string | null
  telephone?: string | null
  email?: string | null
  representant?: string | null
}

export interface PrestataireUpdatePayload {
  raison_sociale?: string
  num_id_fiscal?: string | null
  siege?: string | null
  telephone?: string | null
  email?: string | null
  representant?: string | null
}
