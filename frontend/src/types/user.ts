export type Profil =
  | 'CONSEILLER'
  | 'VP'
  | 'PRESIDENT'
  | 'DG'
  | 'DGA'
  | 'DT'
  | 'DAF'
  | 'SOUS_PREFET'
  | 'ADMIN'

export interface User {
  id: string
  nom: string
  prenom: string
  email: string
  profil: Profil
  telephone?: string | null
  sous_prefecture_id?: string | null
  departement_id?: string | null
  localite_ids?: string[] | null
  photo_profile?: string | null
  is_active: boolean
  is_staff?: boolean
  is_superuser?: boolean
  created_at: string
  updated_at?: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  nom: string
  prenom: string
  profil: Profil
  telephone?: string
  photo_profile?: File
}

export interface UserCreatePayload {
  email: string
  password: string
  nom: string
  prenom: string
  telephone?: string | null
  profil: Profil
  photo_profile?: File | null
}

export interface UserUpdatePayload {
  email?: string
  nom?: string
  prenom?: string
  telephone?: string | null
  profil?: Profil
  photo_profile?: File | null
}

export interface UserProfileUpdatePayload {
  email?: string
  nom?: string
  prenom?: string
  telephone?: string | null
  photo_profile?: File | null
}

export interface ErrorResponse {
  error: string
  detail?: string
}
