export interface Departement {
  id: string
  nom: string
  region_id: string
  chef_lieu_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DepartementFilters {
  region_id?: string
}

export interface DepartementCreatePayload {
  nom: string
  region_id: string
  chef_lieu_id?: string | null
}

export interface DepartementUpdatePayload {
  nom?: string
  region_id?: string
  chef_lieu_id?: string | null
  is_active?: boolean
}
