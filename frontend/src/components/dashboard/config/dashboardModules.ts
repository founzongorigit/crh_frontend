import type { Profil } from '@/types/user'

export interface DashboardModule {
  label: string
  icon: string
  allowedProfiles?: Profil[]
}

export const ADMIN_PROFILES: Profil[] = ['DT', 'ADMIN', 'DG', 'DGA', 'PRESIDENT', 'VP']
export const PAIEMENT_VIEW_PROFILES: Profil[] = [...ADMIN_PROFILES, 'DAF']
export const VALIDATION_VIEW_PROFILES: Profil[] = [
  'CONSEILLER',
  'VP',
  'PRESIDENT',
  'DAF',
  'ADMIN',
  'DG',
  'DGA',
  'DT',
]

export const dashboardModules: DashboardModule[] = [
  { label: 'Tableau de bord', icon: 'pi pi-home' },
  { label: 'Programmes triennaux', icon: 'pi pi-calendar' },
  { label: 'Projets', icon: 'pi pi-folder' },
  { label: 'Projet localités', icon: 'pi pi-map' },
  { label: 'Validations', icon: 'pi pi-check-circle', allowedProfiles: VALIDATION_VIEW_PROFILES },
  { label: 'Paiements', icon: 'pi pi-credit-card', allowedProfiles: PAIEMENT_VIEW_PROFILES },
  { label: 'Cahiers des charges', icon: 'pi pi-file-pdf' },
  { label: 'Alertes terrain', icon: 'pi pi-exclamation-triangle' },
  { label: 'Visites terrain', icon: 'pi pi-compass' },
  { label: "Domaines d'intervention", icon: 'pi pi-briefcase' },
  { label: "Types d'intervention", icon: 'pi pi-list-check' },
  { label: 'Prestataires', icon: 'pi pi-building' },
  { label: 'Territoires', icon: 'pi pi-map-marker' },
  { label: 'Affectations', icon: 'pi pi-share-alt' },
  { label: "Journal d'activités", icon: 'pi pi-book', allowedProfiles: ADMIN_PROFILES },
  { label: 'Utilisateurs', icon: 'pi pi-users', allowedProfiles: ADMIN_PROFILES },
]
