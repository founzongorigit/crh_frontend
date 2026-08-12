export type ProgrammeTriennalStatut = 'EN_PREPARATION' | 'ACTIF' | 'CLOS'

export interface ProgrammeTriennal {
  id: string
  libelle: string
  annee_debut: number
  annee_fin: number
  budget_total: string | number
  statut: ProgrammeTriennalStatut | string
  created_at: string
  updated_at: string
}

export interface ProgrammeTriennalCreatePayload {
  libelle: string
  annee_debut: number
  annee_fin: number
  budget_total: number
  statut?: ProgrammeTriennalStatut | string
}

export interface ProgrammeTriennalUpdatePayload {
  libelle?: string
  annee_debut?: number
  annee_fin?: number
  budget_total?: number
  statut?: ProgrammeTriennalStatut | string
}

export interface ProgrammeTriennalFilters {
  statut?: string
}

export interface ProgrammeTriennalImportError {
  row: number
  error: string
}

export interface ProgrammeTriennalImportResult {
  created: number
  updated: number
  errors: ProgrammeTriennalImportError[]
}
