export interface Region {
  id: string
  nom: string
  chef_lieu_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RegionCreatePayload {
  nom: string
  chef_lieu_id?: string | null
}

export interface RegionUpdatePayload {
  nom?: string
  chef_lieu_id?: string | null
  is_active?: boolean
}
