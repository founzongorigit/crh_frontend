export interface AlerteTerrain {
  id: string
  projet_id: string
  projet_libelle: string
  projet_localite_id: string
  localite_id: string
  localite_nom: string
  emetteur_id: string
  emetteur_email: string
  message: string
  niveau_urgence: string
  date_emission: string
  statut_traitement: string
  traite_par_id: string | null
  traite_par_email: string | null
  date_traitement: string | null
  created_at: string
  updated_at: string
}

export interface AlerteTerrainCreatePayload {
  projet_localite_id: string
  message: string
  niveau_urgence: string
}

export interface AlerteTerrainUpdatePayload {
  projet_localite_id?: string
  message?: string
  niveau_urgence?: string
  statut_traitement?: string
}

export interface AlerteTerrainFilters {
  projet_id?: string
  projet_localite_id?: string
  localite_id?: string
  statut_traitement?: string
  niveau_urgence?: string
}
