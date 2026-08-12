export type VisiteTerrainStatut = 'NON_DEMARRE' | 'EN_COURS' | 'SUSPENDU' | 'ACHEVE'

export interface VisiteTerrain {
  id: string
  projet_id: string
  projet_libelle: string
  projet_localite_id: string
  localite_id: string | null
  localite_nom: string | null
  visiteur_id: string
  visiteur_email: string
  date_visite: string
  taux_constate: string | number
  observations: string | null
  statut_constate: VisiteTerrainStatut | null
  rapport_url: string | null
  created_at: string
  updated_at: string
}

export interface VisiteTerrainCreatePayload {
  projet_localite_id: string
  date_visite: string
  taux_constate?: number
  observations?: string | null
  statut_constate?: VisiteTerrainStatut | null
  rapport?: File | null
}

export interface VisiteTerrainUpdatePayload {
  projet_localite_id?: string
  date_visite?: string
  taux_constate?: number
  observations?: string | null
  statut_constate?: VisiteTerrainStatut | null
  rapport?: File | null
}

export interface VisiteTerrainFilters {
  projet_id?: string
  projet_localite_id?: string
  localite_id?: string
  visiteur_id?: string
}
