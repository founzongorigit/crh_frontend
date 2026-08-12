export interface AffectationConseillerLocalite {
  id: string
  conseiller_id: string
  conseiller_email: string
  conseiller_nom: string
  localite_id: string
  localite_nom: string
  est_principal: boolean
  date_debut: string
  date_fin?: string | null
  created_at: string
  updated_at: string
}

export interface AffectationVPDepartement {
  id: string
  vice_president_id: string
  vice_president_email: string
  vice_president_nom: string
  departement_id: string
  departement_nom: string
  est_principal: boolean
  date_debut: string
  date_fin?: string | null
  created_at: string
  updated_at: string
}

export interface ConseillerAffectationGroup {
  id: string
  conseiller_id: string
  conseiller_nom: string
  conseiller_email: string
  localite_noms: string
  affectations: AffectationConseillerLocalite[]
}

export interface VPAffectationGroup {
  id: string
  vice_president_id: string
  vice_president_nom: string
  vice_president_email: string
  departement_noms: string
  affectations: AffectationVPDepartement[]
}

export interface AffectationFilters {
  active_only?: boolean
}

export interface ConseillerLocalitesPayload {
  localite_ids: string[]
  localite_principale_id?: string | null
}

export interface VPDepartementsPayload {
  departement_ids: string[]
  departement_principal_id?: string | null
}
