import type { ActivityLogAction } from '@/types/activityLog'
import type { TypeReglement } from '@/types/paiement'
import type { Profil } from '@/types/user'
import type { NiveauValidation, StatutValidation } from '@/types/validation'

export const niveauLabels: Record<NiveauValidation, string> = {
  1: 'Conseiller',
  2: 'Vice-Président',
  3: 'Président',
  4: 'DAF',
}

export const niveauOptions: Array<{ label: string; value: NiveauValidation }> = [
  { label: niveauLabels[1], value: 1 },
  { label: niveauLabels[2], value: 2 },
  { label: niveauLabels[3], value: 3 },
  { label: niveauLabels[4], value: 4 },
]

export const statutOptions: Array<{ label: string; value: StatutValidation }> = [
  { label: 'En attente', value: 'EN_ATTENTE' },
  { label: 'Approuvé', value: 'APPROUVE' },
  { label: 'Rejeté', value: 'REJETE' },
]

export const typeReglementOptions: Array<{ label: string; value: TypeReglement }> = [
  { label: 'Partiel', value: 'PARTIEL' },
  { label: 'Total', value: 'TOTAL' },
]

export const profilLabels: Record<Profil, string> = {
  CONSEILLER: 'Conseiller',
  VP: 'Vice-Président',
  PRESIDENT: 'Président',
  DG: 'Directeur Général',
  DGA: 'Directeur Général Adjoint',
  DT: 'Directeur Technique',
  DAF: 'DAF',
  SOUS_PREFET: 'Sous-préfet',
  ADMIN: 'Administrateur',
}

export const profilOptions = Object.entries(profilLabels).map(([value, label]) => ({
  label,
  value: value as Profil,
}))

export const userStatusOptions: Array<{ label: string; value: boolean }> = [
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

export const activityActionLabels: Record<ActivityLogAction, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  STATUS_UPDATE: 'Changement de statut',
  LOGIN: 'Connexion',
  LOGIN_FAILED: 'Connexion échouée',
  LOGOUT: 'Déconnexion',
  PASSWORD_CHANGE: 'Changement de mot de passe',
  RESET_PASSWORD: 'Réinitialisation de mot de passe',
}

export const activityActionOptions = Object.entries(activityActionLabels).map(([value, label]) => ({
  label,
  value: value as ActivityLogAction,
}))
