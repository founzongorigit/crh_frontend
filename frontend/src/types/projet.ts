export type ProjetSourceFinancement = 'FI' | 'SEE' | 'MIXTE'

export type ProjetStatut =
  | 'PLANIFIE'
  | 'EN_COURS'
  | 'EN_VALIDATION'
  | 'VALIDE'
  | 'PAYE_PARTIELLEMENT'
  | 'ACHEVE'
  | 'SUSPENDU'

export interface ProjetLocaliteResume {
  projet_localite_id: string
  id: string
  nom: string
  type: string
  sous_prefecture_id: string
  sous_prefecture_nom: string
  departement_id: string
  departement_nom: string
  taux_realisation: string | number
  statut_execution: string
  is_active: boolean
}

export interface ProjetValidationResume {
  id: string
  niveau: number
  statut: string
  validateur_id: string
  validateur_email: string
  note_sur_20: string | number | null
  commentaire: string | null
  date_validation: string | null
  created_at: string
}

export interface ProjetPaiementResume {
  id: string
  prestataire_id: string
  prestataire_nom: string
  montant: string | number
  type_reglement: string
  date_paiement: string
  validation_daf_id: string
  reference_mandatement: string | null
  created_at: string
}

export interface Projet {
  id: string
  programme_id: string
  programme_libelle: string
  domaine_id: string
  domaine_nom: string
  type_intervention_id: string
  type_intervention_nom: string
  libelle_officiel: string
  code_comptable: string | null
  cout_total: string | number
  source_financement: ProjetSourceFinancement
  statut: ProjetStatut
  taux_realisation: string | number
  note_globale: string | number | null
  localite_ids: string[]
  conseillers_associes_ids: string[]
  created_at: string
  updated_at: string
  depense_anterieure?: string | number
  cout_n?: string | number
  cout_n1?: string | number
  cout_n2?: string | number
  subvention_n?: string | number
  subvention_n1?: string | number
  subvention_n2?: string | number
  prestataire_id?: string | null
  prestataire_nom?: string | null
  delai_realisation_jours?: number | null
  date_debut_prevu?: string | null
}

export interface ProjetDetail extends Projet {
  depense_anterieure: string | number
  cout_n: string | number
  cout_n1: string | number
  cout_n2: string | number
  subvention_n: string | number
  subvention_n1: string | number
  subvention_n2: string | number
  localites: ProjetLocaliteResume[]
  validations: ProjetValidationResume[]
  paiements: ProjetPaiementResume[]
  total_paye: string | number
}

export interface ProjetCreatePayload {
  programme_id: string
  type_intervention_id: string
  libelle_officiel: string
  code_comptable?: string | null
  cout_total: number
  depense_anterieure?: number
  cout_n?: number
  cout_n1?: number
  cout_n2?: number
  subvention_n?: number
  subvention_n1?: number
  subvention_n2?: number
  source_financement: ProjetSourceFinancement
  prestataire_id?: string | null
  delai_realisation_jours?: number | null
  date_debut_prevu?: string | null
  localite_ids?: string[]
}

export interface ProjetUpdatePayload extends Partial<ProjetCreatePayload> {}

export interface ProjetLocalitesUpdatePayload {
  localite_ids: string[]
}

export interface ProjetFilters {
  programme_id?: string
  domaine_id?: string
  type_intervention_id?: string
  statut?: string
  departement_id?: string
  sous_prefecture_id?: string
  localite_id?: string
}
