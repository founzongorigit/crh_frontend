export interface ProjetLocalite {
  id: string
  projet_localite_id: string
  projet_id: string
  projet_libelle: string
  localite_id: string
  nom: string
  type: string
  sous_prefecture_id: string
  sous_prefecture_nom: string
  departement_id: string
  departement_nom: string
  taux_realisation: string | number
  est_suspendu: boolean
  statut_execution: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProjetLocaliteCreatePayload {
  projet_id: string
  localite_id: string
}

export interface ProjetLocaliteUpdatePayload {
  est_suspendu?: boolean
}

export interface ProjetLocaliteFilters {
  projet_id?: string
  localite_id?: string
  departement_id?: string
  sous_prefecture_id?: string
}
