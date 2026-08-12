<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import type { DataTableFilterMeta } from 'primevue/datatable'
import { useConfirm } from 'primevue/useconfirm'
import AffectationConseillerDetailsDialog from '@/components/dashboard/dialogs/affectations/AffectationConseillerDetailsDialog.vue'
import AffectationConseillerFormDialog from '@/components/dashboard/dialogs/affectations/AffectationConseillerFormDialog.vue'
import AffectationVPDetailsDialog from '@/components/dashboard/dialogs/affectations/AffectationVPDetailsDialog.vue'
import AffectationVPFormDialog from '@/components/dashboard/dialogs/affectations/AffectationVPFormDialog.vue'
import AlerteTerrainDetailsDialog from '@/components/dashboard/dialogs/alertes_terrain/AlerteTerrainDetailsDialog.vue'
import AlerteTerrainFormDialog from '@/components/dashboard/dialogs/alertes_terrain/AlerteTerrainFormDialog.vue'
import AlerteTerrainTraitementDialog from '@/components/dashboard/dialogs/alertes_terrain/AlerteTerrainTraitementDialog.vue'
import CahierChargesDetailsDialog from '@/components/dashboard/dialogs/cahiers_charges/CahierChargesDetailsDialog.vue'
import CahierChargesFormDialog from '@/components/dashboard/dialogs/cahiers_charges/CahierChargesFormDialog.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '@/components/dashboard/DashboardTopbar.vue'
import ActivityLogModule from '@/components/dashboard/modules/ActivityLogModule.vue'
import AffectationsModule from '@/components/dashboard/modules/AffectationsModule.vue'
import AlertesTerrainModule from '@/components/dashboard/modules/AlertesTerrainModule.vue'
import CahiersChargesModule from '@/components/dashboard/modules/CahiersChargesModule.vue'
import DashboardStatsModule from '@/components/dashboard/modules/DashboardStatsModule.vue'
import DomainesInterventionModule from '@/components/dashboard/modules/DomainesInterventionModule.vue'
import PaiementsModule from '@/components/dashboard/modules/PaiementsModule.vue'
import PrestatairesModule from '@/components/dashboard/modules/PrestatairesModule.vue'
import ProjetsModule from '@/components/dashboard/modules/ProjetsModule.vue'
import PojetLocalitesModule from '@/components/dashboard/modules/PojetLocalitesModule.vue'
import PtModule from '@/components/dashboard/modules/PtModule.vue'
import TypesInterventionModule from '@/components/dashboard/modules/TypesInterventionModule.vue'
import UtilisateursModule from '@/components/dashboard/modules/UtilisateursModule.vue'
import ValidationsModule from '@/components/dashboard/modules/ValidationsModule.vue'
import VisitesTerrainModule from '@/components/dashboard/modules/VisitesTerrainModule.vue'
import TerritoiresModule from '@/components/dashboard/modules/territoires/TerritoiresModule.vue'
import DomaineInterventionDetailsDialog from '@/components/dashboard/dialogs/domaines_intervention/DomaineInterventionDetailsDialog.vue'
import DomaineInterventionFormDialog from '@/components/dashboard/dialogs/domaines_intervention/DomaineInterventionFormDialog.vue'
import PaiementDetailsDialog from '@/components/dashboard/dialogs/paiements/PaiementDetailsDialog.vue'
import PaiementFormDialog from '@/components/dashboard/dialogs/paiements/PaiementFormDialog.vue'
import PrestataireDetailsDialog from '@/components/dashboard/dialogs/prestataires/PrestataireDetailsDialog.vue'
import PrestataireFormDialog from '@/components/dashboard/dialogs/prestataires/PrestataireFormDialog.vue'
import ProjetLocaliteDetailsDialog from '@/components/dashboard/dialogs/projet_localites/ProjetLocaliteDetailsDialog.vue'
import ProjetLocaliteFormDialog from '@/components/dashboard/dialogs/projet_localites/ProjetLocaliteFormDialog.vue'
import ProjetDetailsDialog from '@/components/dashboard/dialogs/projets/ProjetDetailsDialog.vue'
import ProjetFormDialog from '@/components/dashboard/dialogs/projets/ProjetFormDialog.vue'
import PtDetailsDialog from '@/components/dashboard/dialogs/programmes/PtDetailsDialog.vue'
import PtFormDialog from '@/components/dashboard/dialogs/programmes/PtFormDialog.vue'
import DepartementDetailsDialog from '@/components/dashboard/dialogs/territoires/departements/DepartementDetailsDialog.vue'
import DepartementFormDialog from '@/components/dashboard/dialogs/territoires/departements/DepartementFormDialog.vue'
import LocaliteDetailsDialog from '@/components/dashboard/dialogs/territoires/localites/LocaliteDetailsDialog.vue'
import LocaliteFormDialog from '@/components/dashboard/dialogs/territoires/localites/LocaliteFormDialog.vue'
import RegionDetailsDialog from '@/components/dashboard/dialogs/territoires/regions/RegionDetailsDialog.vue'
import RegionFormDialog from '@/components/dashboard/dialogs/territoires/regions/RegionFormDialog.vue'
import SousPrefectureDetailsDialog from '@/components/dashboard/dialogs/territoires/sous_prefectures/Sous_prefectureDetailsDialog.vue'
import SousPrefectureFormDialog from '@/components/dashboard/dialogs/territoires/sous_prefectures/Sous_prefectureFormDialog.vue'
import TypeInterventionDetailsDialog from '@/components/dashboard/dialogs/types_intervention/TypeInterventionDetailsDialog.vue'
import TypeInterventionFormDialog from '@/components/dashboard/dialogs/types_intervention/TypeInterventionFormDialog.vue'
import UserDetailsDialog from '@/components/dashboard/dialogs/users/UserDetailsDialog.vue'
import UserFormDialog from '@/components/dashboard/dialogs/users/UserFormDialog.vue'
import UserProfileFormDialog from '@/components/dashboard/dialogs/users/UserProfileFormDialog.vue'
import ValidationDetailsDialog from '@/components/dashboard/dialogs/validations/ValidationDetailsDialog.vue'
import ValidationFormDialog from '@/components/dashboard/dialogs/validations/ValidationFormDialog.vue'
import { ADMIN_PROFILES, dashboardModules } from '@/components/dashboard/config/dashboardModules'
import {
  activityActionOptions,
  niveauOptions,
  profilOptions,
  statutOptions,
  typeReglementOptions,
  userStatusOptions,
} from '@/components/dashboard/config/dashboardOptions'
import { useActivityLogStore } from '@/stores/activityLog'
import { useAffectationStore } from '@/stores/affectation'
import { useAlerteTerrainStore } from '@/stores/alerteTerrain'
import { useAuthStore } from '@/stores/auth'
import { useCahierChargesStore } from '@/stores/cahierCharges'
import { useDomaineInterventionStore } from '@/stores/domaineIntervention'
import { usePaiementStore } from '@/stores/paiement'
import { usePrestataireStore } from '@/stores/prestataire'
import { useProjetStore } from '@/stores/projet'
import { useProjetLocaliteStore } from '@/stores/projetLocalite'
import { usePtStore } from '@/stores/pt'
import { useDepartementStore } from '@/stores/territoires/departement'
import { useLocaliteStore } from '@/stores/territoires/localite'
import { useRegionStore } from '@/stores/territoires/region'
import { useSousPrefectureStore } from '@/stores/territoires/sous_prefecture'
import { useTypeInterventionStore } from '@/stores/typeIntervention'
import { useUserStore } from '@/stores/user'
import { useValidationStore } from '@/stores/validation'
import { useVisiteTerrainStore } from '@/stores/visiteTerrain'
import type {
  AffectationConseillerLocalite,
  AffectationVPDepartement,
  ConseillerLocalitesPayload,
  ConseillerAffectationGroup,
  VPDepartementsPayload,
  VPAffectationGroup,
} from '@/types/affectation'
import type {
  AlerteTerrain,
  AlerteTerrainCreatePayload,
  AlerteTerrainUpdatePayload,
} from '@/types/alerteTerrain'
import type {
  CahierCharges,
  CahierChargesCreatePayload,
  CahierChargesUpdatePayload,
} from '@/types/cahierCharges'
import type {
  DomaineIntervention,
  DomaineInterventionCreatePayload,
  DomaineInterventionUpdatePayload,
} from '@/types/domaineIntervention'
import type {
  Paiement,
  PaiementCreatePayload,
  PaiementUpdatePayload,
  TypeReglement,
} from '@/types/paiement'
import type {
  Prestataire,
  PrestataireCreatePayload,
  PrestataireUpdatePayload,
} from '@/types/prestataire'
import type { Projet, ProjetCreatePayload, ProjetUpdatePayload } from '@/types/projet'
import type { ProjetLocalite, ProjetLocaliteCreatePayload } from '@/types/projetLocalite'
import type {
  ProgrammeTriennal,
  ProgrammeTriennalCreatePayload,
  ProgrammeTriennalUpdatePayload,
} from '@/types/pt'
import type {
  Departement,
  DepartementCreatePayload,
  DepartementUpdatePayload,
} from '@/types/territoires/departement'
import type {
  Localite,
  LocaliteCreatePayload,
  LocaliteImportResult,
  LocaliteUpdatePayload,
} from '@/types/territoires/localite'
import type { Region, RegionCreatePayload, RegionUpdatePayload } from '@/types/territoires/region'
import type {
  SousPrefecture,
  SousPrefectureCreatePayload,
  SousPrefectureUpdatePayload,
} from '@/types/territoires/sous_prefecture'
import type {
  TypeIntervention,
  TypeInterventionCreatePayload,
  TypeInterventionUpdatePayload,
} from '@/types/typeIntervention'
import type { Profil, User, UserCreatePayload, UserProfileUpdatePayload, UserUpdatePayload } from '@/types/user'
import type {
  NiveauValidation,
  StatutValidation,
  Validation,
  ValidationUpdatePayload,
} from '@/types/validation'
import type { ActivityLogAction } from '@/types/activityLog'
import VisiteTerrainDetailsDialog from '@/components/dashboard/dialogs/visites_terrain/VisiteTerrainDetailsDialog.vue'
import VisiteTerrainFormDialog from '@/components/dashboard/dialogs/visites_terrain/VisiteTerrainFormDialog.vue'
import type {
  VisiteTerrain,
  VisiteTerrainCreatePayload,
  VisiteTerrainUpdatePayload,
} from '@/types/visiteTerrain'

const router = useRouter()
const confirm = useConfirm()
const authStore = useAuthStore()
const activityLogStore = useActivityLogStore()
const affectationStore = useAffectationStore()
const validationStore = useValidationStore()
const paiementStore = usePaiementStore()
const ptStore = usePtStore()
const projetStore = useProjetStore()
const projetLocaliteStore = useProjetLocaliteStore()
const alerteTerrainStore = useAlerteTerrainStore()
const visiteTerrainStore = useVisiteTerrainStore()
const cahierChargesStore = useCahierChargesStore()
const domaineInterventionStore = useDomaineInterventionStore()
const typeInterventionStore = useTypeInterventionStore()
const prestataireStore = usePrestataireStore()
const userStore = useUserStore()
const regionStore = useRegionStore()
const departementStore = useDepartementStore()
const sousPrefectureStore = useSousPrefectureStore()
const localiteStore = useLocaliteStore()
const { user } = storeToRefs(authStore)
const visibleDashboardModules = computed(() =>
  dashboardModules.filter((module) => {
    if (!module.allowedProfiles) return true
    if (!user.value) return false

    return module.allowedProfiles.includes(user.value.profil)
  }),
)
const canManageProgrammes = computed(() =>
  Boolean(user.value && ADMIN_PROFILES.includes(user.value.profil)),
)
const canManageProjets = computed(() =>
  Boolean(user.value && ADMIN_PROFILES.includes(user.value.profil)),
)
const canManageProjetLocalites = computed(() =>
  Boolean(user.value && ADMIN_PROFILES.includes(user.value.profil)),
)
const canManageAdminModules = computed(() =>
  Boolean(user.value && ADMIN_PROFILES.includes(user.value.profil)),
)
const canManageAlertes = computed(() =>
  Boolean(user.value && (ADMIN_PROFILES.includes(user.value.profil) || user.value.profil === 'SOUS_PREFET')),
)
const canTreatAlertes = computed(() =>
  Boolean(user.value && ADMIN_PROFILES.includes(user.value.profil)),
)
const canManagePaiements = computed(() => user.value?.profil === 'DAF')
const canManageValidations = computed(() =>
  Boolean(user.value && ['PRESIDENT', 'VP', 'CONSEILLER', 'DAF'].includes(user.value.profil)),
)
const {
  activityLogs,
  loading: activityLogsLoading,
  error: activityLogsError,
} = storeToRefs(activityLogStore)
const {
  conseillerLocalites,
  vpDepartements,
  loading: affectationsLoading,
  error: affectationsError,
} = storeToRefs(affectationStore)
const {
  validations,
  loading: validationsLoading,
  error: validationsError,
} = storeToRefs(validationStore)
const {
  paiements,
  loading: paiementsLoading,
  error: paiementsError,
} = storeToRefs(paiementStore)
const {
  programmes,
  loading: programmesLoading,
  error: programmesError,
} = storeToRefs(ptStore)
const {
  projets,
  loading: projetsLoading,
  error: projetsError,
} = storeToRefs(projetStore)
const {
  projetLocalites,
  loading: projetLocalitesLoading,
  error: projetLocalitesError,
} = storeToRefs(projetLocaliteStore)
const {
  alertesTerrain,
  loading: alertesTerrainLoading,
  error: alertesTerrainError,
} = storeToRefs(alerteTerrainStore)
const {
  visitesTerrain,
  loading: visitesTerrainLoading,
  error: visitesTerrainError,
} = storeToRefs(visiteTerrainStore)
const {
  cahiersCharges,
  loading: cahiersChargesLoading,
  error: cahiersChargesError,
} = storeToRefs(cahierChargesStore)
const {
  domainesIntervention,
  loading: domainesInterventionLoading,
  error: domainesInterventionError,
} = storeToRefs(domaineInterventionStore)
const {
  typesIntervention,
  loading: typesInterventionLoading,
  error: typesInterventionError,
} = storeToRefs(typeInterventionStore)
const {
  prestataires,
  loading: prestatairesLoading,
  error: prestatairesError,
} = storeToRefs(prestataireStore)
const {
  users,
  loading: usersLoading,
  error: usersError,
} = storeToRefs(userStore)
const {
  regions,
  loading: regionsLoading,
  error: regionsError,
} = storeToRefs(regionStore)
const {
  departements,
  loading: departementsLoading,
  error: departementsError,
} = storeToRefs(departementStore)
const {
  sousPrefectures,
  loading: sousPrefecturesLoading,
  error: sousPrefecturesError,
} = storeToRefs(sousPrefectureStore)
const {
  localites,
  loading: localitesLoading,
  error: localitesError,
} = storeToRefs(localiteStore)
const activeModule = ref('Tableau de bord')
const activeTerritoryTab = ref<'regions' | 'departements' | 'sousPrefectures' | 'localites'>('regions')
const activeAffectationTab = ref<'conseillers' | 'vp'>('conseillers')
const sidebarCollapsed = ref(false)
const formDialogVisible = ref(false)
const detailsDialogVisible = ref(false)
const selectedValidation = ref<Validation | null>(null)
const paiementFormDialogVisible = ref(false)
const paiementDetailsDialogVisible = ref(false)
const selectedPaiement = ref<Paiement | null>(null)
const userFormDialogVisible = ref(false)
const userDetailsDialogVisible = ref(false)
const userProfileFormDialogVisible = ref(false)
const currentUserDetailsEditable = ref(false)
const selectedUser = ref<User | null>(null)
const regionFormDialogVisible = ref(false)
const regionDetailsDialogVisible = ref(false)
const selectedRegion = ref<Region | null>(null)
const departementFormDialogVisible = ref(false)
const departementDetailsDialogVisible = ref(false)
const selectedDepartement = ref<Departement | null>(null)
const sousPrefectureFormDialogVisible = ref(false)
const sousPrefectureDetailsDialogVisible = ref(false)
const selectedSousPrefecture = ref<SousPrefecture | null>(null)
const localiteFormDialogVisible = ref(false)
const localiteDetailsDialogVisible = ref(false)
const selectedLocalite = ref<Localite | null>(null)
const localiteCsvInput = ref<HTMLInputElement | null>(null)
const localiteImportResult = ref<LocaliteImportResult | null>(null)
const affectationConseillerDialogVisible = ref(false)
const affectationVPDialogVisible = ref(false)
const affectationConseillerDetailsVisible = ref(false)
const affectationVPDetailsVisible = ref(false)
const selectedConseillerAffectationId = ref<string | null>(null)
const selectedVPAffectationId = ref<string | null>(null)
const selectedConseillerAffectations = ref<AffectationConseillerLocalite[]>([])
const selectedVPAffectations = ref<AffectationVPDepartement[]>([])
const programmeFormDialogVisible = ref(false)
const programmeDetailsDialogVisible = ref(false)
const selectedProgramme = ref<ProgrammeTriennal | null>(null)
const projetFormDialogVisible = ref(false)
const projetDetailsDialogVisible = ref(false)
const selectedProjet = ref<Projet | null>(null)
const projetLocaliteFormDialogVisible = ref(false)
const projetLocaliteDetailsDialogVisible = ref(false)
const selectedProjetLocalite = ref<ProjetLocalite | null>(null)
const alerteTerrainFormDialogVisible = ref(false)
const alerteTerrainTraitementDialogVisible = ref(false)
const alerteTerrainDetailsDialogVisible = ref(false)
const selectedAlerteTerrain = ref<AlerteTerrain | null>(null)
const visiteTerrainFormDialogVisible = ref(false)
const visiteTerrainDetailsDialogVisible = ref(false)
const selectedVisiteTerrain = ref<VisiteTerrain | null>(null)
const cahierChargesFormDialogVisible = ref(false)
const cahierChargesDetailsDialogVisible = ref(false)
const selectedCahierCharges = ref<CahierCharges | null>(null)
const domaineInterventionFormDialogVisible = ref(false)
const domaineInterventionDetailsDialogVisible = ref(false)
const selectedDomaineIntervention = ref<DomaineIntervention | null>(null)
const typeInterventionFormDialogVisible = ref(false)
const typeInterventionDetailsDialogVisible = ref(false)
const selectedTypeIntervention = ref<TypeIntervention | null>(null)
const prestataireFormDialogVisible = ref(false)
const prestataireDetailsDialogVisible = ref(false)
const selectedPrestataire = ref<Prestataire | null>(null)

const validationfilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  niveau: { value: null, matchMode: 'equals' },
  statut: { value: null, matchMode: 'equals' },
})
const paiementFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  type_reglement: { value: null, matchMode: 'equals' },
})
const userFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  profil: { value: null, matchMode: 'equals' },
  is_active: { value: null, matchMode: 'equals' },
})
const territoryFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const activityLogFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  action: { value: null, matchMode: 'equals' },
})
const affectationFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const domaineInterventionFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const typeInterventionFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  domaine_id: { value: null, matchMode: 'equals' },
})
const prestataireFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const programmeFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const projetFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const projetLocaliteFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const alerteTerrainFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const visiteTerrainFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
})
const cahierChargesFilters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  type_intervention_id: { value: null, matchMode: 'equals' },
  actif: { value: null, matchMode: 'equals' },
})
const globalSearch = ref('')
const paiementGlobalSearch = ref('')
const userGlobalSearch = ref('')
const territoryGlobalSearch = ref('')
const activityLogGlobalSearch = ref('')
const affectationGlobalSearch = ref('')
const domaineInterventionGlobalSearch = ref('')
const typeInterventionGlobalSearch = ref('')
const prestataireGlobalSearch = ref('')
const programmeGlobalSearch = ref('')
const projetGlobalSearch = ref('')
const projetLocaliteGlobalSearch = ref('')
const alerteTerrainGlobalSearch = ref('')
const visiteTerrainGlobalSearch = ref('')
const cahierChargesGlobalSearch = ref('')
const selectedNiveau = ref<NiveauValidation | null>(null)
const selectedStatut = ref<StatutValidation | null>(null)
const selectedTypeReglement = ref<TypeReglement | null>(null)
const selectedProfil = ref<Profil | null>(null)
const selectedUserStatus = ref<boolean | null>(null)
const selectedActivityAction = ref<ActivityLogAction | null>(null)
const selectedTypeInterventionDomaine = ref<string | null>(null)
const selectedCahierChargesTypeIntervention = ref<string | null>(null)
const selectedCahierChargesActif = ref<boolean | null>(null)
const actifOptions: Array<{ label: string; value: boolean }> = [
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

const groupedConseillerLocalites = computed<ConseillerAffectationGroup[]>(() => {
  const groups = new Map<string, ConseillerAffectationGroup>()

  conseillerLocalites.value.forEach((affectation) => {
    const group = groups.get(affectation.conseiller_id)

    if (group) {
      group.affectations.push(affectation)
      group.localite_noms = group.affectations.map((item) => item.localite_nom).join(', ')
      return
    }

    groups.set(affectation.conseiller_id, {
      id: affectation.conseiller_id,
      conseiller_id: affectation.conseiller_id,
      conseiller_nom: affectation.conseiller_nom,
      conseiller_email: affectation.conseiller_email,
      localite_noms: affectation.localite_nom,
      affectations: [affectation],
    })
  })

  return Array.from(groups.values())
})

const groupedVPDepartements = computed<VPAffectationGroup[]>(() => {
  const groups = new Map<string, VPAffectationGroup>()

  vpDepartements.value.forEach((affectation) => {
    const group = groups.get(affectation.vice_president_id)

    if (group) {
      group.affectations.push(affectation)
      group.departement_noms = group.affectations.map((item) => item.departement_nom).join(', ')
      return
    }

    groups.set(affectation.vice_president_id, {
      id: affectation.vice_president_id,
      vice_president_id: affectation.vice_president_id,
      vice_president_nom: affectation.vice_president_nom,
      vice_president_email: affectation.vice_president_email,
      departement_noms: affectation.departement_nom,
      affectations: [affectation],
    })
  })

  return Array.from(groups.values())
})

const sousPrefetOptions = computed(() => users.value.filter((item) => item.profil === 'SOUS_PREFET'))

onMounted(() => {
  fetchDashboardStats()
})

// Remet les champs de filtre à zéro.
const resetValidationFilters = () => {
  globalSearch.value = ''
  selectedNiveau.value = null
  selectedStatut.value = null
}

const resetPaiementFilters = () => {
  paiementGlobalSearch.value = ''
  selectedTypeReglement.value = null
}

const resetUserFilters = () => {
  userGlobalSearch.value = ''
  selectedProfil.value = null
  selectedUserStatus.value = null
}

const resetTerritoryFilters = () => {
  territoryGlobalSearch.value = ''
}

const resetActivityLogFilters = () => {
  activityLogGlobalSearch.value = ''
  selectedActivityAction.value = null
}

const resetAffectationFilters = () => {
  affectationGlobalSearch.value = ''
}

const resetDomaineInterventionFilters = () => {
  domaineInterventionGlobalSearch.value = ''
}

const resetTypeInterventionFilters = () => {
  typeInterventionGlobalSearch.value = ''
  selectedTypeInterventionDomaine.value = null
}

const resetPrestataireFilters = () => {
  prestataireGlobalSearch.value = ''
}

const resetProgrammeFilters = () => {
  programmeGlobalSearch.value = ''
}

const resetProjetFilters = () => {
  projetGlobalSearch.value = ''
}

const resetProjetLocaliteFilters = () => {
  projetLocaliteGlobalSearch.value = ''
}

const resetAlerteTerrainFilters = () => {
  alerteTerrainGlobalSearch.value = ''
}

const resetVisiteTerrainFilters = () => {
  visiteTerrainGlobalSearch.value = ''
}

const resetCahierChargesFilters = () => {
  cahierChargesGlobalSearch.value = ''
  selectedCahierChargesTypeIntervention.value = null
  selectedCahierChargesActif.value = null
}

// Synchronise les champs de filtre simples avec le format attendu par DataTable.
watch([globalSearch, selectedNiveau, selectedStatut], () => {
  validationfilters.value = {
    global: { value: globalSearch.value || null, matchMode: 'contains' },
    niveau: { value: selectedNiveau.value, matchMode: 'equals' },
    statut: { value: selectedStatut.value, matchMode: 'equals' },
  }
})

watch([paiementGlobalSearch, selectedTypeReglement], () => {
  paiementFilters.value = {
    global: { value: paiementGlobalSearch.value || null, matchMode: 'contains' },
    type_reglement: { value: selectedTypeReglement.value, matchMode: 'equals' },
  }
})

watch([userGlobalSearch, selectedProfil, selectedUserStatus], () => {
  userFilters.value = {
    global: { value: userGlobalSearch.value || null, matchMode: 'contains' },
    profil: { value: selectedProfil.value, matchMode: 'equals' },
    is_active: { value: selectedUserStatus.value, matchMode: 'equals' },
  }
})

watch(territoryGlobalSearch, () => {
  territoryFilters.value = {
    global: { value: territoryGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch([activityLogGlobalSearch, selectedActivityAction], () => {
  activityLogFilters.value = {
    global: { value: activityLogGlobalSearch.value || null, matchMode: 'contains' },
    action: { value: selectedActivityAction.value, matchMode: 'equals' },
  }
})

watch(affectationGlobalSearch, () => {
  affectationFilters.value = {
    global: { value: affectationGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(domaineInterventionGlobalSearch, () => {
  domaineInterventionFilters.value = {
    global: { value: domaineInterventionGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch([typeInterventionGlobalSearch, selectedTypeInterventionDomaine], () => {
  typeInterventionFilters.value = {
    global: { value: typeInterventionGlobalSearch.value || null, matchMode: 'contains' },
    domaine_id: { value: selectedTypeInterventionDomaine.value, matchMode: 'equals' },
  }
})

watch(prestataireGlobalSearch, () => {
  prestataireFilters.value = {
    global: { value: prestataireGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(programmeGlobalSearch, () => {
  programmeFilters.value = {
    global: { value: programmeGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(projetGlobalSearch, () => {
  projetFilters.value = {
    global: { value: projetGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(projetLocaliteGlobalSearch, () => {
  projetLocaliteFilters.value = {
    global: { value: projetLocaliteGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(alerteTerrainGlobalSearch, () => {
  alerteTerrainFilters.value = {
    global: { value: alerteTerrainGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(visiteTerrainGlobalSearch, () => {
  visiteTerrainFilters.value = {
    global: { value: visiteTerrainGlobalSearch.value || null, matchMode: 'contains' },
  }
})

watch(
  [cahierChargesGlobalSearch, selectedCahierChargesTypeIntervention, selectedCahierChargesActif],
  () => {
    cahierChargesFilters.value = {
      global: { value: cahierChargesGlobalSearch.value || null, matchMode: 'contains' },
      type_intervention_id: {
        value: selectedCahierChargesTypeIntervention.value,
        matchMode: 'equals',
      },
      actif: { value: selectedCahierChargesActif.value, matchMode: 'equals' },
    }
  },
)

const openEditValidation = (validation: Validation) => {
  selectedValidation.value = validation
  formDialogVisible.value = true
}

const openValidationDetails = (validation: Validation) => {
  selectedValidation.value = validation
  detailsDialogVisible.value = true
}

const saveValidation = async (payload: ValidationUpdatePayload) => {
  if (!selectedValidation.value) return

  await validationStore.updateValidation(selectedValidation.value.id, payload)

  formDialogVisible.value = false
  selectedValidation.value = null
}

const confirmDelete = (message: string, accept: () => void | Promise<void>) => {
  confirm.require({
    message,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    acceptClass: 'p-button-danger',
    accept,
  })
}

const confirmAction = (
  message: string,
  acceptLabel: string,
  accept: () => void | Promise<void>,
  acceptClass = 'p-button-primary',
) => {
  confirm.require({
    message,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Annuler',
    acceptLabel,
    acceptClass,
    accept,
  })
}

const openCreatePaiement = () => {
  selectedPaiement.value = null
  fetchPaiementFormDependencies()
  paiementFormDialogVisible.value = true
}

const openEditPaiement = (paiement: Paiement) => {
  selectedPaiement.value = paiement
  fetchPaiementFormDependencies()
  paiementFormDialogVisible.value = true
}

const openPaiementDetails = (paiement: Paiement) => {
  selectedPaiement.value = paiement
  paiementDetailsDialogVisible.value = true
}

const fetchPaiementFormDependencies = () =>
  Promise.all([
    projets.value.length === 0 ? projetStore.fetchProjets() : Promise.resolve(projets.value),
    prestataires.value.length === 0
      ? prestataireStore.fetchPrestataires()
      : Promise.resolve(prestataires.value),
    validations.value.length === 0
      ? validationStore.fetchValidations()
      : Promise.resolve(validations.value),
  ])

const savePaiement = async (payload: PaiementCreatePayload | PaiementUpdatePayload) => {
  if (selectedPaiement.value) {
    await paiementStore.updatePaiement(selectedPaiement.value.id, payload)
  } else {
    await paiementStore.createPaiement(payload as PaiementCreatePayload)
  }

  paiementFormDialogVisible.value = false
  selectedPaiement.value = null
}

const deletePaiement = async (paiement: Paiement) => {
  await paiementStore.deletePaiement(paiement.id)
}

const confirmDeletePaiement = (paiement: Paiement) => {
  confirmDelete(`Voulez-vous supprimer le paiement de ${formatMontant(paiement.montant)} ?`, () =>
    deletePaiement(paiement),
  )
}

const openCreateDomaineIntervention = () => {
  selectedDomaineIntervention.value = null
  domaineInterventionFormDialogVisible.value = true
}

const openEditDomaineIntervention = (domaine: DomaineIntervention) => {
  selectedDomaineIntervention.value = domaine
  domaineInterventionFormDialogVisible.value = true
}

const openDomaineInterventionDetails = (domaine: DomaineIntervention) => {
  selectedDomaineIntervention.value = domaine
  domaineInterventionDetailsDialogVisible.value = true
}

const saveDomaineIntervention = async (
  payload: DomaineInterventionCreatePayload | DomaineInterventionUpdatePayload,
) => {
  if (selectedDomaineIntervention.value) {
    await domaineInterventionStore.updateDomaineIntervention(
      selectedDomaineIntervention.value.id,
      payload,
    )
  } else {
    await domaineInterventionStore.createDomaineIntervention(payload as DomaineInterventionCreatePayload)
  }

  domaineInterventionFormDialogVisible.value = false
  selectedDomaineIntervention.value = null
}

const deleteDomaineIntervention = async (domaine: DomaineIntervention) => {
  await domaineInterventionStore.deleteDomaineIntervention(domaine.id)
}

const confirmDeleteDomaineIntervention = (domaine: DomaineIntervention) => {
  confirmDelete(`Voulez-vous supprimer le domaine ${domaine.nom} ?`, () =>
    deleteDomaineIntervention(domaine),
  )
}

const openCreateTypeIntervention = () => {
  selectedTypeIntervention.value = null
  if (domainesIntervention.value.length === 0) domaineInterventionStore.fetchDomainesIntervention()
  typeInterventionFormDialogVisible.value = true
}

const openEditTypeIntervention = (typeIntervention: TypeIntervention) => {
  selectedTypeIntervention.value = typeIntervention
  if (domainesIntervention.value.length === 0) domaineInterventionStore.fetchDomainesIntervention()
  typeInterventionFormDialogVisible.value = true
}

const openTypeInterventionDetails = (typeIntervention: TypeIntervention) => {
  selectedTypeIntervention.value = typeIntervention
  typeInterventionDetailsDialogVisible.value = true
}

const saveTypeIntervention = async (
  payload: TypeInterventionCreatePayload | TypeInterventionUpdatePayload,
) => {
  if (selectedTypeIntervention.value) {
    await typeInterventionStore.updateTypeIntervention(selectedTypeIntervention.value.id, payload)
  } else {
    await typeInterventionStore.createTypeIntervention(payload as TypeInterventionCreatePayload)
  }

  typeInterventionFormDialogVisible.value = false
  selectedTypeIntervention.value = null
}

const deleteTypeIntervention = async (typeIntervention: TypeIntervention) => {
  await typeInterventionStore.deleteTypeIntervention(typeIntervention.id)
}

const confirmDeleteTypeIntervention = (typeIntervention: TypeIntervention) => {
  confirmDelete(`Voulez-vous supprimer le type ${typeIntervention.nom} ?`, () =>
    deleteTypeIntervention(typeIntervention),
  )
}

const openCreatePrestataire = () => {
  selectedPrestataire.value = null
  prestataireFormDialogVisible.value = true
}

const openEditPrestataire = (prestataire: Prestataire) => {
  selectedPrestataire.value = prestataire
  prestataireFormDialogVisible.value = true
}

const openPrestataireDetails = (prestataire: Prestataire) => {
  selectedPrestataire.value = prestataire
  prestataireDetailsDialogVisible.value = true
}

const savePrestataire = async (payload: PrestataireCreatePayload | PrestataireUpdatePayload) => {
  if (selectedPrestataire.value) {
    await prestataireStore.updatePrestataire(selectedPrestataire.value.id, payload)
  } else {
    await prestataireStore.createPrestataire(payload as PrestataireCreatePayload)
  }

  prestataireFormDialogVisible.value = false
  selectedPrestataire.value = null
}

const deletePrestataire = async (prestataire: Prestataire) => {
  await prestataireStore.deletePrestataire(prestataire.id)
}

const confirmDeletePrestataire = (prestataire: Prestataire) => {
  confirmDelete(`Voulez-vous supprimer le prestataire ${prestataire.raison_sociale} ?`, () =>
    deletePrestataire(prestataire),
  )
}

const openCreateProgramme = () => {
  selectedProgramme.value = null
  programmeFormDialogVisible.value = true
}

const openEditProgramme = (programme: ProgrammeTriennal) => {
  selectedProgramme.value = programme
  programmeFormDialogVisible.value = true
}

const openProgrammeDetails = (programme: ProgrammeTriennal) => {
  selectedProgramme.value = programme
  programmeDetailsDialogVisible.value = true
}

const saveProgramme = async (
  payload: ProgrammeTriennalCreatePayload | ProgrammeTriennalUpdatePayload,
) => {
  if (selectedProgramme.value) {
    await ptStore.updateProgramme(selectedProgramme.value.id, payload)
  } else {
    await ptStore.createProgramme(payload as ProgrammeTriennalCreatePayload)
  }

  programmeFormDialogVisible.value = false
  selectedProgramme.value = null
}

const confirmDeleteProgramme = (programme: ProgrammeTriennal) => {
  confirmDelete(`Voulez-vous supprimer le programme ${programme.libelle} ?`, () =>
    ptStore.deleteProgramme(programme.id),
  )
}

const fetchProjetFormDependencies = () =>
  Promise.all([
    programmes.value.length === 0 ? ptStore.fetchProgrammes() : Promise.resolve(programmes.value),
    typesIntervention.value.length === 0
      ? typeInterventionStore.fetchTypesIntervention()
      : Promise.resolve(typesIntervention.value),
    prestataires.value.length === 0
      ? prestataireStore.fetchPrestataires()
      : Promise.resolve(prestataires.value),
    localites.value.length === 0 ? localiteStore.fetchLocalites() : Promise.resolve(localites.value),
  ])

const openCreateProjet = () => {
  selectedProjet.value = null
  fetchProjetFormDependencies()
  projetFormDialogVisible.value = true
}

const openEditProjet = (projet: Projet) => {
  selectedProjet.value = projet
  fetchProjetFormDependencies()
  projetFormDialogVisible.value = true
}

const openProjetDetails = (projet: Projet) => {
  selectedProjet.value = projet
  projetDetailsDialogVisible.value = true
}

const saveProjet = async (payload: ProjetCreatePayload | ProjetUpdatePayload) => {
  if (selectedProjet.value) {
    await projetStore.updateProjet(selectedProjet.value.id, payload)
  } else {
    await projetStore.createProjet(payload as ProjetCreatePayload)
  }

  projetFormDialogVisible.value = false
  selectedProjet.value = null
}

const confirmDeleteProjet = (projet: Projet) => {
  confirmDelete(`Voulez-vous supprimer le projet ${projet.libelle_officiel} ?`, () =>
    projetStore.deleteProjet(projet.id),
  )
}

const fetchProjetLocaliteFormDependencies = () =>
  Promise.all([
    projets.value.length === 0 ? projetStore.fetchProjets() : Promise.resolve(projets.value),
    localites.value.length === 0 ? localiteStore.fetchLocalites() : Promise.resolve(localites.value),
  ])

const openCreateProjetLocalite = () => {
  selectedProjetLocalite.value = null
  fetchProjetLocaliteFormDependencies()
  projetLocaliteFormDialogVisible.value = true
}

const openProjetLocaliteDetails = (projetLocalite: ProjetLocalite) => {
  selectedProjetLocalite.value = projetLocalite
  projetLocaliteDetailsDialogVisible.value = true
}

const saveProjetLocalite = async (payload: ProjetLocaliteCreatePayload) => {
  await projetLocaliteStore.createProjetLocalite(payload)
  projetLocaliteFormDialogVisible.value = false
  selectedProjetLocalite.value = null
}

const confirmDeleteProjetLocalite = (projetLocalite: ProjetLocalite) => {
  confirmDelete(`Voulez-vous retirer ${projetLocalite.nom} du projet ${projetLocalite.projet_libelle} ?`, () =>
    projetLocaliteStore.deleteProjetLocalite(projetLocalite.id),
  )
}

const confirmToggleProjetLocaliteSuspension = (projetLocalite: ProjetLocalite) => {
  const action = projetLocalite.est_suspendu ? 'reprendre' : 'suspendre'
  const estSuspendu = !projetLocalite.est_suspendu

  confirmAction(
    `Voulez-vous ${action} ${projetLocalite.nom} pour le projet ${projetLocalite.projet_libelle} ?`,
    projetLocalite.est_suspendu ? 'Reprendre' : 'Suspendre',
    async () => {
      await projetLocaliteStore.updateProjetLocalite(projetLocalite.id, { est_suspendu: estSuspendu })
    },
    projetLocalite.est_suspendu ? 'p-button-success' : 'p-button-danger',
  )
}

const fetchAlerteTerrainFormDependencies = () =>
  Promise.all([
    projetLocalites.value.length === 0
      ? projetLocaliteStore.fetchAllProjetLocalites()
      : Promise.resolve(projetLocalites.value),
  ])

const openCreateAlerteTerrain = () => {
  selectedAlerteTerrain.value = null
  fetchAlerteTerrainFormDependencies()
  alerteTerrainFormDialogVisible.value = true
}

const openEditAlerteTerrain = (alerte: AlerteTerrain) => {
  selectedAlerteTerrain.value = alerte
  alerteTerrainTraitementDialogVisible.value = true
}

const openAlerteTerrainDetails = (alerte: AlerteTerrain) => {
  selectedAlerteTerrain.value = alerte
  alerteTerrainDetailsDialogVisible.value = true
}

const saveAlerteTerrain = async (payload: AlerteTerrainCreatePayload) => {
  await alerteTerrainStore.createAlerteTerrain(payload)
  alerteTerrainFormDialogVisible.value = false
  selectedAlerteTerrain.value = null
}

const saveAlerteTerrainTraitement = async (payload: AlerteTerrainUpdatePayload) => {
  if (!selectedAlerteTerrain.value) return

  await alerteTerrainStore.updateAlerteTerrain(selectedAlerteTerrain.value.id, payload)
  alerteTerrainTraitementDialogVisible.value = false
  selectedAlerteTerrain.value = null
}

const confirmDeleteAlerteTerrain = (alerte: AlerteTerrain) => {
  confirmDelete(`Voulez-vous supprimer l'alerte de ${alerte.localite_nom} ?`, () =>
    alerteTerrainStore.deleteAlerteTerrain(alerte.id),
  )
}

const fetchVisiteTerrainFormDependencies = () =>
  Promise.all([
    projetLocalites.value.length === 0
      ? projetLocaliteStore.fetchAllProjetLocalites()
      : Promise.resolve(projetLocalites.value),
  ])

const openCreateVisiteTerrain = () => {
  selectedVisiteTerrain.value = null
  fetchVisiteTerrainFormDependencies()
  visiteTerrainFormDialogVisible.value = true
}

const openEditVisiteTerrain = (visite: VisiteTerrain) => {
  selectedVisiteTerrain.value = visite
  fetchVisiteTerrainFormDependencies()
  visiteTerrainFormDialogVisible.value = true
}

const openVisiteTerrainDetails = (visite: VisiteTerrain) => {
  selectedVisiteTerrain.value = visite
  visiteTerrainDetailsDialogVisible.value = true
}

const saveVisiteTerrain = async (payload: VisiteTerrainCreatePayload | VisiteTerrainUpdatePayload) => {
  if (selectedVisiteTerrain.value) {
    await visiteTerrainStore.updateVisiteTerrain(selectedVisiteTerrain.value.id, payload)
  } else {
    await visiteTerrainStore.createVisiteTerrain(payload as VisiteTerrainCreatePayload)
  }

  visiteTerrainFormDialogVisible.value = false
  selectedVisiteTerrain.value = null
}

const confirmDeleteVisiteTerrain = (visite: VisiteTerrain) => {
  confirmDelete(`Voulez-vous supprimer la visite de ${visite.localite_nom || visite.projet_libelle} ?`, () =>
    visiteTerrainStore.deleteVisiteTerrain(visite.id),
  )
}

const openCreateCahierCharges = () => {
  selectedCahierCharges.value = null
  if (typesIntervention.value.length === 0) typeInterventionStore.fetchTypesIntervention()
  cahierChargesFormDialogVisible.value = true
}

const openEditCahierCharges = (cahier: CahierCharges) => {
  selectedCahierCharges.value = cahier
  if (typesIntervention.value.length === 0) typeInterventionStore.fetchTypesIntervention()
  cahierChargesFormDialogVisible.value = true
}

const openCahierChargesDetails = (cahier: CahierCharges) => {
  selectedCahierCharges.value = cahier
  cahierChargesDetailsDialogVisible.value = true
}

const saveCahierCharges = async (payload: CahierChargesCreatePayload | CahierChargesUpdatePayload) => {
  if (selectedCahierCharges.value) {
    await cahierChargesStore.updateCahierCharges(selectedCahierCharges.value.id, payload)
  } else {
    await cahierChargesStore.createCahierCharges(payload as CahierChargesCreatePayload)
  }

  cahierChargesFormDialogVisible.value = false
  selectedCahierCharges.value = null
}

const confirmDeleteCahierCharges = (cahier: CahierCharges) => {
  confirmDelete(`Voulez-vous supprimer le cahier des charges ${cahier.version} ?`, () =>
    cahierChargesStore.deleteCahierCharges(cahier.id),
  )
}

const openCreateUser = () => {
  selectedUser.value = null
  userFormDialogVisible.value = true
}

const openEditUser = (userToEdit: User) => {
  selectedUser.value = userToEdit
  userFormDialogVisible.value = true
}

const openUserDetails = (userToView: User) => {
  selectedUser.value = userToView
  currentUserDetailsEditable.value = false
  userDetailsDialogVisible.value = true
}

const openCurrentUserDetails = () => {
  if (!user.value) return

  selectedUser.value = user.value
  currentUserDetailsEditable.value = true
  userDetailsDialogVisible.value = true
}

const openCurrentUserProfileForm = () => {
  userProfileFormDialogVisible.value = true
}

const saveCurrentUserProfile = async (payload: UserProfileUpdatePayload) => {
  const updatedUser = await authStore.updateProfile(payload)
  selectedUser.value = updatedUser
  userProfileFormDialogVisible.value = false
}

const saveUser = async (payload: UserCreatePayload | UserUpdatePayload) => {
  if (selectedUser.value) {
    await userStore.updateUser(selectedUser.value.id, payload)
  } else {
    await userStore.createUser(payload as UserCreatePayload)
  }

  userFormDialogVisible.value = false
  selectedUser.value = null
}

const toggleUserStatus = async (userToToggle: User) => {
  await userStore.updateUserStatus(userToToggle.id, !userToToggle.is_active)
}

const deleteUser = async (userToDelete: User) => {
  await userStore.deleteUser(userToDelete.id)
}

const confirmDeleteUser = (userToDelete: User) => {
  confirmDelete(`Voulez-vous supprimer l'utilisateur ${userToDelete.prenom} ${userToDelete.nom} ?`, () =>
    deleteUser(userToDelete),
  )
}

const openCreateRegion = () => {
  selectedRegion.value = null
  regionFormDialogVisible.value = true
}

const openEditRegion = (region: Region) => {
  selectedRegion.value = region
  regionFormDialogVisible.value = true
}

const openRegionDetails = (region: Region) => {
  selectedRegion.value = region
  regionDetailsDialogVisible.value = true
}

const saveRegion = async (payload: RegionCreatePayload | RegionUpdatePayload) => {
  if (selectedRegion.value) {
    await regionStore.updateRegion(selectedRegion.value.id, payload)
  } else {
    await regionStore.createRegion(payload as RegionCreatePayload)
  }

  regionFormDialogVisible.value = false
  selectedRegion.value = null
}

const toggleRegionStatus = async (region: Region) => {
  await regionStore.updateRegionStatus(region.id, !region.is_active)
}

const deleteRegion = async (region: Region) => {
  await regionStore.deleteRegion(region.id)
}

const confirmDeleteRegion = (region: Region) => {
  confirmDelete(`Voulez-vous supprimer la région ${region.nom} ?`, () => deleteRegion(region))
}

const openCreateDepartement = () => {
  selectedDepartement.value = null
  departementFormDialogVisible.value = true
}

const openEditDepartement = (departement: Departement) => {
  selectedDepartement.value = departement
  departementFormDialogVisible.value = true
}

const openDepartementDetails = (departement: Departement) => {
  selectedDepartement.value = departement
  departementDetailsDialogVisible.value = true
}

const saveDepartement = async (payload: DepartementCreatePayload | DepartementUpdatePayload) => {
  if (selectedDepartement.value) {
    await departementStore.updateDepartement(selectedDepartement.value.id, payload)
  } else {
    await departementStore.createDepartement(payload as DepartementCreatePayload)
  }

  departementFormDialogVisible.value = false
  selectedDepartement.value = null
}

const toggleDepartementStatus = async (departement: Departement) => {
  await departementStore.updateDepartementStatus(departement.id, !departement.is_active)
}

const deleteDepartement = async (departement: Departement) => {
  await departementStore.deleteDepartement(departement.id)
}

const confirmDeleteDepartement = (departement: Departement) => {
  confirmDelete(`Voulez-vous supprimer le département ${departement.nom} ?`, () =>
    deleteDepartement(departement),
  )
}

const openCreateSousPrefecture = () => {
  selectedSousPrefecture.value = null
  sousPrefectureFormDialogVisible.value = true
}

const openEditSousPrefecture = (sousPrefecture: SousPrefecture) => {
  selectedSousPrefecture.value = sousPrefecture
  sousPrefectureFormDialogVisible.value = true
}

const openSousPrefectureDetails = (sousPrefecture: SousPrefecture) => {
  selectedSousPrefecture.value = sousPrefecture
  sousPrefectureDetailsDialogVisible.value = true
}

const saveSousPrefecture = async (
  payload: SousPrefectureCreatePayload | SousPrefectureUpdatePayload,
) => {
  if (selectedSousPrefecture.value) {
    await sousPrefectureStore.updateSousPrefecture(selectedSousPrefecture.value.id, payload)
  } else {
    await sousPrefectureStore.createSousPrefecture(payload as SousPrefectureCreatePayload)
  }

  sousPrefectureFormDialogVisible.value = false
  selectedSousPrefecture.value = null
}

const toggleSousPrefectureStatus = async (sousPrefecture: SousPrefecture) => {
  await sousPrefectureStore.updateSousPrefectureStatus(sousPrefecture.id, !sousPrefecture.is_active)
}

const deleteSousPrefecture = async (sousPrefecture: SousPrefecture) => {
  await sousPrefectureStore.deleteSousPrefecture(sousPrefecture.id)
}

const confirmDeleteSousPrefecture = (sousPrefecture: SousPrefecture) => {
  confirmDelete(`Voulez-vous supprimer la sous-préfecture ${sousPrefecture.nom} ?`, () =>
    deleteSousPrefecture(sousPrefecture),
  )
}

const openCreateLocalite = () => {
  selectedLocalite.value = null
  localiteFormDialogVisible.value = true
}

const openEditLocalite = (localite: Localite) => {
  selectedLocalite.value = localite
  localiteFormDialogVisible.value = true
}

const openLocaliteDetails = (localite: Localite) => {
  selectedLocalite.value = localite
  localiteDetailsDialogVisible.value = true
}

const saveLocalite = async (payload: LocaliteCreatePayload | LocaliteUpdatePayload) => {
  if (selectedLocalite.value) {
    await localiteStore.updateLocalite(selectedLocalite.value.id, payload)
  } else {
    await localiteStore.createLocalite(payload as LocaliteCreatePayload)
  }

  localiteFormDialogVisible.value = false
  selectedLocalite.value = null
}

const toggleLocaliteStatus = async (localite: Localite) => {
  await localiteStore.updateLocaliteStatus(localite.id, !localite.is_active)
}

const deleteLocalite = async (localite: Localite) => {
  await localiteStore.deleteLocalite(localite.id)
}

const confirmDeleteLocalite = (localite: Localite) => {
  confirmDelete(`Voulez-vous supprimer la localité ${localite.nom} ?`, () => deleteLocalite(localite))
}

const openLocaliteCsvPicker = () => {
  localiteCsvInput.value?.click()
}

const importLocalitesCsv = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  localiteImportResult.value = await localiteStore.importLocalitesCsv(file)
  input.value = ''
}

const openCreateConseillerAffectation = () => {
  selectedConseillerAffectationId.value = null
  affectationConseillerDialogVisible.value = true
}

const openEditConseillerAffectation = (affectation: ConseillerAffectationGroup) => {
  selectedConseillerAffectationId.value = affectation.conseiller_id
  affectationConseillerDialogVisible.value = true
}

const openConseillerAffectationDetails = (affectation: ConseillerAffectationGroup) => {
  selectedConseillerAffectations.value = affectation.affectations
  affectationConseillerDetailsVisible.value = true
}

const openCreateVPAffectation = () => {
  selectedVPAffectationId.value = null
  affectationVPDialogVisible.value = true
}

const openEditVPAffectation = (affectation: VPAffectationGroup) => {
  selectedVPAffectationId.value = affectation.vice_president_id
  affectationVPDialogVisible.value = true
}

const openVPAffectationDetails = (affectation: VPAffectationGroup) => {
  selectedVPAffectations.value = affectation.affectations
  affectationVPDetailsVisible.value = true
}

const saveConseillerAffectation = async (
  userId: string,
  payload: ConseillerLocalitesPayload,
) => {
  await affectationStore.updateConseillerLocalites(userId, payload)
  await userStore.fetchUsers()
  affectationConseillerDialogVisible.value = false
  selectedConseillerAffectationId.value = null
}

const saveVPAffectation = async (userId: string, payload: VPDepartementsPayload) => {
  await affectationStore.updateVPDepartements(userId, payload)
  await userStore.fetchUsers()
  affectationVPDialogVisible.value = false
  selectedVPAffectationId.value = null
}

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const formatMontant = (montant: Paiement['montant']) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(montant))

const getTerritoryLoading = () => {
  if (activeTerritoryTab.value === 'regions') return regionsLoading.value
  if (activeTerritoryTab.value === 'departements') return departementsLoading.value
  if (activeTerritoryTab.value === 'sousPrefectures') return sousPrefecturesLoading.value

  return localitesLoading.value
}

const getTerritoryError = () => {
  if (activeTerritoryTab.value === 'regions') return regionsError.value
  if (activeTerritoryTab.value === 'departements') return departementsError.value
  if (activeTerritoryTab.value === 'sousPrefectures') return sousPrefecturesError.value

  return localitesError.value
}

const fetchTerritories = async () => {
  await Promise.all([
    regionStore.fetchRegions(),
    departementStore.fetchDepartements(),
    sousPrefectureStore.fetchSousPrefectures(),
    localiteStore.fetchLocalites(),
  ])

  if (users.value.length === 0) {
    await userStore.fetchUsers()
  }
}

const fetchAffectationDependencies = async () => {
  await Promise.all([
    affectationStore.fetchAffectations(),
    users.value.length === 0 ? userStore.fetchUsers() : Promise.resolve(users.value),
    localites.value.length === 0 ? localiteStore.fetchLocalites() : Promise.resolve(localites.value),
    departements.value.length === 0 ? departementStore.fetchDepartements() : Promise.resolve(departements.value),
  ])
}

const fetchDashboardStats = async () => {
  await Promise.all([
    programmes.value.length === 0 ? ptStore.fetchProgrammes() : Promise.resolve(programmes.value),
    projets.value.length === 0 ? projetStore.fetchProjets() : Promise.resolve(projets.value),
    projetLocalites.value.length === 0
      ? projetLocaliteStore.fetchAllProjetLocalites()
      : Promise.resolve(projetLocalites.value),
    alertesTerrain.value.length === 0
      ? alerteTerrainStore.fetchAlertesTerrain()
      : Promise.resolve(alertesTerrain.value),
    visitesTerrain.value.length === 0
      ? visiteTerrainStore.fetchVisitesTerrain()
      : Promise.resolve(visitesTerrain.value),
    cahiersCharges.value.length === 0
      ? cahierChargesStore.fetchCahiersCharges()
      : Promise.resolve(cahiersCharges.value),
    validations.value.length === 0 ? validationStore.fetchValidations() : Promise.resolve(validations.value),
    paiements.value.length === 0 ? paiementStore.fetchPaiements() : Promise.resolve(paiements.value),
    prestataires.value.length === 0
      ? prestataireStore.fetchPrestataires()
      : Promise.resolve(prestataires.value),
    users.value.length === 0 ? userStore.fetchUsers() : Promise.resolve(users.value),
    localites.value.length === 0 ? localiteStore.fetchLocalites() : Promise.resolve(localites.value),
    domainesIntervention.value.length === 0
      ? domaineInterventionStore.fetchDomainesIntervention()
      : Promise.resolve(domainesIntervention.value),
    typesIntervention.value.length === 0
      ? typeInterventionStore.fetchTypesIntervention()
      : Promise.resolve(typesIntervention.value),
    conseillerLocalites.value.length === 0 && vpDepartements.value.length === 0
      ? affectationStore.fetchAffectations()
      : Promise.resolve({ conseillers: conseillerLocalites.value, vp: vpDepartements.value }),
    activityLogs.value.length === 0
      ? activityLogStore.fetchActivityLogs()
      : Promise.resolve(activityLogs.value),
  ])
}

const canAccessModule = (moduleLabel: string) =>
  visibleDashboardModules.value.some((module) => module.label === moduleLabel)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const selectModule = (moduleLabel: string) => {
  if (!canAccessModule(moduleLabel)) {
    activeModule.value = 'Tableau de bord'
    return
  }

  activeModule.value = moduleLabel

  if (moduleLabel === 'Tableau de bord') {
    fetchDashboardStats()
  }

  if (moduleLabel === 'Paiements' && paiements.value.length === 0) {
    paiementStore.fetchPaiements()
  }

  if (moduleLabel === 'Programmes triennaux' && programmes.value.length === 0) {
    ptStore.fetchProgrammes()
  }

  if (moduleLabel === 'Projets' && projets.value.length === 0) {
    projetStore.fetchProjets()
  }

  if (moduleLabel === 'Projet localités' && projetLocalites.value.length === 0) {
    projetLocaliteStore.fetchAllProjetLocalites()
  }

  if (moduleLabel === 'Alertes terrain' && alertesTerrain.value.length === 0) {
    alerteTerrainStore.fetchAlertesTerrain()
  }

  if (moduleLabel === 'Visites terrain' && visitesTerrain.value.length === 0) {
    visiteTerrainStore.fetchVisitesTerrain()
  }

  if (moduleLabel === 'Cahiers des charges' && cahiersCharges.value.length === 0) {
    cahierChargesStore.fetchCahiersCharges()
  }

  if (moduleLabel === 'Cahiers des charges' && typesIntervention.value.length === 0) {
    typeInterventionStore.fetchTypesIntervention()
  }

  if (moduleLabel === "Domaines d'intervention" && domainesIntervention.value.length === 0) {
    domaineInterventionStore.fetchDomainesIntervention()
  }

  if (moduleLabel === "Types d'intervention" && typesIntervention.value.length === 0) {
    typeInterventionStore.fetchTypesIntervention()
  }

  if (
    moduleLabel === "Types d'intervention" &&
    domainesIntervention.value.length === 0
  ) {
    domaineInterventionStore.fetchDomainesIntervention()
  }

  if (moduleLabel === 'Prestataires' && prestataires.value.length === 0) {
    prestataireStore.fetchPrestataires()
  }

  if (moduleLabel === 'Utilisateurs' && users.value.length === 0) {
    userStore.fetchUsers()
  }

  if (
    moduleLabel === 'Utilisateurs' &&
    (sousPrefectures.value.length === 0 || departements.value.length === 0 || localites.value.length === 0)
  ) {
    fetchTerritories()
  }

  if (moduleLabel === 'Territoires' && regions.value.length === 0) {
    fetchTerritories()
  }

  if (moduleLabel === 'Affectations' && conseillerLocalites.value.length === 0 && vpDepartements.value.length === 0) {
    fetchAffectationDependencies()
  }

  if (moduleLabel === "Journal d'activités" && activityLogs.value.length === 0) {
    activityLogStore.fetchActivityLogs()
  }
}

watch(visibleDashboardModules, () => {
  if (!canAccessModule(activeModule.value)) {
    activeModule.value = 'Tableau de bord'
  }
})

const openCreateForActiveModule = () => {
  if (activeModule.value === 'Programmes triennaux') {
    if (!canManageProgrammes.value) return
    openCreateProgramme()
    return
  }

  if (activeModule.value === 'Projets') {
    openCreateProjet()
    return
  }

  if (activeModule.value === 'Projet localités') {
    openCreateProjetLocalite()
    return
  }

  if (activeModule.value === 'Alertes terrain') {
    if (!canManageAlertes.value) return
    openCreateAlerteTerrain()
    return
  }

  if (activeModule.value === 'Visites terrain') {
    if (!canManageAdminModules.value) return
    openCreateVisiteTerrain()
    return
  }

  if (activeModule.value === 'Cahiers des charges') {
    if (!canManageAdminModules.value) return
    openCreateCahierCharges()
    return
  }

  if (activeModule.value === 'Paiements') {
    if (!canManagePaiements.value) return
    openCreatePaiement()
    return
  }

  if (activeModule.value === "Domaines d'intervention") {
    if (!canManageAdminModules.value) return
    openCreateDomaineIntervention()
    return
  }

  if (activeModule.value === "Types d'intervention") {
    if (!canManageAdminModules.value) return
    openCreateTypeIntervention()
    return
  }

  if (activeModule.value === 'Prestataires') {
    if (!canManageAdminModules.value) return
    openCreatePrestataire()
    return
  }

  if (activeModule.value === 'Utilisateurs') {
    if (!canManageAdminModules.value) return
    openCreateUser()
    return
  }

  if (activeModule.value === 'Territoires') {
    if (!canManageAdminModules.value) return
    if (activeTerritoryTab.value === 'regions') openCreateRegion()
    if (activeTerritoryTab.value === 'departements') openCreateDepartement()
    if (activeTerritoryTab.value === 'sousPrefectures') openCreateSousPrefecture()
    if (activeTerritoryTab.value === 'localites') openCreateLocalite()
    return
  }

  if (activeModule.value === 'Affectations') {
    if (!canManageAdminModules.value) return
    if (activeAffectationTab.value === 'conseillers') {
      openCreateConseillerAffectation()
    } else {
      openCreateVPAffectation()
    }
    return
  }

  return
}

const getCreateButtonLabel = () => {
  if (activeModule.value === "Journal d'activités") return ''
  if (activeModule.value === 'Tableau de bord') return ''
  if (activeModule.value === 'Validations') return ''
  if (activeModule.value === 'Programmes triennaux' && !canManageProgrammes.value) return ''
  if (activeModule.value === 'Programmes triennaux') return 'Nouveau programme'
  if (activeModule.value === 'Projets' && !canManageProjets.value) return ''
  if (activeModule.value === 'Projets') return 'Nouveau projet'
  if (activeModule.value === 'Projet localités' && !canManageProjetLocalites.value) return ''
  if (activeModule.value === 'Projet localités') return 'Ajouter une localité'
  if (activeModule.value === 'Alertes terrain' && !canManageAlertes.value) return ''
  if (activeModule.value === 'Alertes terrain') return 'Nouvelle alerte'
  if (activeModule.value === 'Visites terrain' && !canManageAdminModules.value) return ''
  if (activeModule.value === 'Visites terrain') return 'Nouvelle visite'
  if (activeModule.value === 'Cahiers des charges' && !canManageAdminModules.value) return ''
  if (activeModule.value === 'Cahiers des charges') return 'Nouveau cahier'
  if (activeModule.value === 'Paiements' && !canManagePaiements.value) return ''
  if (activeModule.value === 'Paiements') return 'Nouveau paiement'
  if (activeModule.value === "Domaines d'intervention" && !canManageAdminModules.value) return ''
  if (activeModule.value === "Domaines d'intervention") return 'Nouveau domaine'
  if (activeModule.value === "Types d'intervention" && !canManageAdminModules.value) return ''
  if (activeModule.value === "Types d'intervention") return 'Nouveau type'
  if (activeModule.value === 'Prestataires' && !canManageAdminModules.value) return ''
  if (activeModule.value === 'Prestataires') return 'Nouveau prestataire'
  if (activeModule.value === 'Utilisateurs' && !canManageAdminModules.value) return ''
  if (activeModule.value === 'Utilisateurs') return 'Nouvel utilisateur'
  if (activeModule.value === 'Affectations' && !canManageAdminModules.value) return ''
  if (activeModule.value === 'Affectations') {
    return activeAffectationTab.value === 'conseillers' ? 'Affecter conseiller' : 'Affecter VP'
  }
  if (activeModule.value === 'Territoires' && !canManageAdminModules.value) return ''
  if (activeModule.value === 'Territoires') {
    if (activeTerritoryTab.value === 'regions') return 'Nouvelle région'
    if (activeTerritoryTab.value === 'departements') return 'Nouveau département'
    if (activeTerritoryTab.value === 'sousPrefectures') return 'Nouvelle sous-préfecture'
    return 'Nouvelle localité'
  }
  return ''
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    await router.push({ name: 'Login' })
  } catch {
    // L'erreur est déjà renseignée dans le store
  }
}
</script>

<template>
  <div class="layout-wrapper">
    <ConfirmDialog />

    <DashboardTopbar
      :user="user"
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
      @view-profile="openCurrentUserDetails"
      @logout="handleLogout"
    />

    <div class="dashboard-shell" :class="{ 'is-sidebar-collapsed': sidebarCollapsed }">
      <DashboardSidebar
        :modules="visibleDashboardModules"
        :active-module="activeModule"
        :collapsed="sidebarCollapsed"
        @select="selectModule"
      />

      <main class="layout-content">
        <!-- Entête de la page courante. -->
        <section class="dashboard-heading">
          <div>
            <span class="eyebrow">Tableau de bord</span>
            <h1>{{ activeModule }}</h1>
          </div>
          <div class="heading-actions">
            <input
              ref="localiteCsvInput"
              type="file"
              accept=".csv,text/csv"
              class="sr-only"
              @change="importLocalitesCsv"
            />
            <Button
              v-if="activeModule === 'Territoires' && activeTerritoryTab === 'localites' && canManageAdminModules"
              icon="pi pi-upload"
              label="Importer CSV"
              severity="secondary"
              outlined
              :loading="localitesLoading"
              @click="openLocaliteCsvPicker"
            />
            <Button
              v-if="
                activeModule !== `Journal d'activités` &&
                activeModule !== 'Tableau de bord' &&
                activeModule !== 'Validations' &&
                getCreateButtonLabel()
              "
              icon="pi pi-plus"
              :label="getCreateButtonLabel()"
              @click="openCreateForActiveModule"
            />
          </div>
        </section>

        <DashboardStatsModule
          v-if="activeModule === 'Tableau de bord'"
          :modules="visibleDashboardModules"
          :programmes="programmes"
          :projets="projets"
          :projet-localites="projetLocalites"
          :alertes-terrain="alertesTerrain"
          :visites-terrain="visitesTerrain"
          :cahiers-charges="cahiersCharges"
          :validations="validations"
          :paiements="paiements"
          :prestataires="prestataires"
          :users="users"
          :localites="localites"
          :domaines-intervention="domainesIntervention"
          :types-intervention="typesIntervention"
          :conseiller-localites="conseillerLocalites"
          :vp-departements="vpDepartements"
          :activity-logs="activityLogs"
          :loading="
            programmesLoading ||
            projetsLoading ||
            projetLocalitesLoading ||
            alertesTerrainLoading ||
            visitesTerrainLoading ||
            cahiersChargesLoading ||
            validationsLoading ||
            paiementsLoading ||
            prestatairesLoading ||
            usersLoading ||
            localitesLoading ||
            domainesInterventionLoading ||
            typesInterventionLoading ||
            affectationsLoading ||
            activityLogsLoading
          "
          @select-module="selectModule"
        />

        <ValidationsModule
          v-if="
            activeModule === 'Validations'
          "
          v-model:filters="validationfilters"
          v-model:global-search="globalSearch"
          v-model:selected-niveau="selectedNiveau"
          v-model:selected-statut="selectedStatut"
          :validations="validations"
          :loading="validationsLoading"
          :error="validationsError"
          :niveau-options="niveauOptions"
          :statut-options="statutOptions"
          :can-manage="canManageValidations"
          @reset-filters="resetValidationFilters"
          @view="openValidationDetails"
          @edit="openEditValidation"
        />

        <AffectationsModule
          v-else-if="activeModule === 'Affectations'"
          v-model:active-tab="activeAffectationTab"
          v-model:filters="affectationFilters"
          v-model:global-search="affectationGlobalSearch"
          :conseiller-groups="groupedConseillerLocalites"
          :vp-groups="groupedVPDepartements"
          :loading="affectationsLoading"
          :error="affectationsError"
          :can-manage="canManageAdminModules"
          @refresh="fetchAffectationDependencies"
          @reset-filters="resetAffectationFilters"
          @view-conseiller="openConseillerAffectationDetails"
          @edit-conseiller="openEditConseillerAffectation"
          @view-v-p="openVPAffectationDetails"
          @edit-v-p="openEditVPAffectation"
        />

        <PtModule
          v-else-if="activeModule === 'Programmes triennaux'"
          v-model:filters="programmeFilters"
          v-model:global-search="programmeGlobalSearch"
          :programmes="programmes"
          :loading="programmesLoading"
          :error="programmesError"
          :can-manage="canManageProgrammes"
          @refresh="ptStore.fetchProgrammes()"
          @reset-filters="resetProgrammeFilters"
          @view="openProgrammeDetails"
          @edit="openEditProgramme"
          @delete="confirmDeleteProgramme"
        />

        <ProjetsModule
          v-else-if="activeModule === 'Projets'"
          v-model:filters="projetFilters"
          v-model:global-search="projetGlobalSearch"
          :projets="projets"
          :loading="projetsLoading"
          :error="projetsError"
          :can-manage="canManageProjets"
          @refresh="projetStore.fetchProjets()"
          @reset-filters="resetProjetFilters"
          @view="openProjetDetails"
          @edit="openEditProjet"
          @delete="confirmDeleteProjet"
        />

        <PojetLocalitesModule
          v-else-if="activeModule === 'Projet localités'"
          v-model:filters="projetLocaliteFilters"
          v-model:global-search="projetLocaliteGlobalSearch"
          :projet-localites="projetLocalites"
          :loading="projetLocalitesLoading"
          :error="projetLocalitesError"
          :can-manage="canManageProjetLocalites"
          @refresh="projetLocaliteStore.fetchAllProjetLocalites()"
          @reset-filters="resetProjetLocaliteFilters"
          @view="openProjetLocaliteDetails"
          @toggle-suspension="confirmToggleProjetLocaliteSuspension"
          @delete="confirmDeleteProjetLocalite"
        />

        <AlertesTerrainModule
          v-else-if="activeModule === 'Alertes terrain'"
          v-model:filters="alerteTerrainFilters"
          v-model:global-search="alerteTerrainGlobalSearch"
          :alertes="alertesTerrain"
          :loading="alertesTerrainLoading"
          :error="alertesTerrainError"
          :can-manage="canManageAlertes"
          :can-treat="canTreatAlertes"
          @refresh="alerteTerrainStore.fetchAlertesTerrain()"
          @reset-filters="resetAlerteTerrainFilters"
          @view="openAlerteTerrainDetails"
          @edit="openEditAlerteTerrain"
          @delete="confirmDeleteAlerteTerrain"
        />

        <VisitesTerrainModule
          v-else-if="activeModule === 'Visites terrain'"
          v-model:filters="visiteTerrainFilters"
          v-model:global-search="visiteTerrainGlobalSearch"
          :visites="visitesTerrain"
          :loading="visitesTerrainLoading"
          :error="visitesTerrainError"
          :can-manage="canManageAdminModules"
          @refresh="visiteTerrainStore.fetchVisitesTerrain()"
          @reset-filters="resetVisiteTerrainFilters"
          @view="openVisiteTerrainDetails"
          @edit="openEditVisiteTerrain"
          @delete="confirmDeleteVisiteTerrain"
        />

        <CahiersChargesModule
          v-else-if="activeModule === 'Cahiers des charges'"
          v-model:filters="cahierChargesFilters"
          v-model:global-search="cahierChargesGlobalSearch"
          v-model:selected-type-intervention="selectedCahierChargesTypeIntervention"
          v-model:selected-actif="selectedCahierChargesActif"
          :cahiers="cahiersCharges"
          :types-intervention="typesIntervention"
          :loading="cahiersChargesLoading || typesInterventionLoading"
          :error="cahiersChargesError || typesInterventionError"
          :actif-options="actifOptions"
          :can-manage="canManageAdminModules"
          @refresh="cahierChargesStore.fetchCahiersCharges()"
          @reset-filters="resetCahierChargesFilters"
          @view="openCahierChargesDetails"
          @edit="openEditCahierCharges"
          @delete="confirmDeleteCahierCharges"
        />

        <ActivityLogModule
          v-else-if="activeModule === `Journal d'activités`"
          v-model:filters="activityLogFilters"
          v-model:global-search="activityLogGlobalSearch"
          v-model:selected-action="selectedActivityAction"
          :logs="activityLogs"
          :loading="activityLogsLoading"
          :error="activityLogsError"
          :action-options="activityActionOptions"
          @refresh="activityLogStore.fetchActivityLogs()"
          @reset-filters="resetActivityLogFilters"
        />

        <PaiementsModule
          v-else-if="activeModule === 'Paiements'"
          v-model:filters="paiementFilters"
          v-model:global-search="paiementGlobalSearch"
          v-model:selected-type-reglement="selectedTypeReglement"
          :paiements="paiements"
          :loading="paiementsLoading"
          :error="paiementsError"
          :type-reglement-options="typeReglementOptions"
          :can-manage="canManagePaiements"
          @reset-filters="resetPaiementFilters"
          @view="openPaiementDetails"
          @edit="openEditPaiement"
          @delete="confirmDeletePaiement"
        />

        <DomainesInterventionModule
          v-else-if="activeModule === `Domaines d'intervention`"
          v-model:filters="domaineInterventionFilters"
          v-model:global-search="domaineInterventionGlobalSearch"
          :domaines="domainesIntervention"
          :loading="domainesInterventionLoading"
          :error="domainesInterventionError"
          :can-manage="canManageAdminModules"
          @refresh="domaineInterventionStore.fetchDomainesIntervention()"
          @reset-filters="resetDomaineInterventionFilters"
          @view="openDomaineInterventionDetails"
          @edit="openEditDomaineIntervention"
          @delete="confirmDeleteDomaineIntervention"
        />

        <TypesInterventionModule
          v-else-if="activeModule === `Types d'intervention`"
          v-model:filters="typeInterventionFilters"
          v-model:global-search="typeInterventionGlobalSearch"
          v-model:selected-domaine="selectedTypeInterventionDomaine"
          :types-intervention="typesIntervention"
          :domaines="domainesIntervention"
          :loading="typesInterventionLoading || domainesInterventionLoading"
          :error="typesInterventionError || domainesInterventionError"
          :can-manage="canManageAdminModules"
          @refresh="typeInterventionStore.fetchTypesIntervention()"
          @reset-filters="resetTypeInterventionFilters"
          @view="openTypeInterventionDetails"
          @edit="openEditTypeIntervention"
          @delete="confirmDeleteTypeIntervention"
        />

        <PrestatairesModule
          v-else-if="activeModule === 'Prestataires'"
          v-model:filters="prestataireFilters"
          v-model:global-search="prestataireGlobalSearch"
          :prestataires="prestataires"
          :loading="prestatairesLoading"
          :error="prestatairesError"
          :can-manage="canManageAdminModules"
          @refresh="prestataireStore.fetchPrestataires()"
          @reset-filters="resetPrestataireFilters"
          @view="openPrestataireDetails"
          @edit="openEditPrestataire"
          @delete="confirmDeletePrestataire"
        />

        <UtilisateursModule
          v-else-if="activeModule === 'Utilisateurs'"
          v-model:filters="userFilters"
          v-model:global-search="userGlobalSearch"
          v-model:selected-profil="selectedProfil"
          v-model:selected-status="selectedUserStatus"
          :users="users"
          :loading="usersLoading"
          :error="usersError"
          :profil-options="profilOptions"
          :status-options="userStatusOptions"
          :can-manage="canManageAdminModules"
          @reset-filters="resetUserFilters"
          @view="openUserDetails"
          @edit="openEditUser"
          @toggle-status="toggleUserStatus"
          @delete="confirmDeleteUser"
        />

        <TerritoiresModule
          v-else-if="activeModule === 'Territoires'"
          v-model:active-tab="activeTerritoryTab"
          v-model:filters="territoryFilters"
          v-model:global-search="territoryGlobalSearch"
          :regions="regions"
          :departements="departements"
          :sous-prefectures="sousPrefectures"
          :localites="localites"
          :sous-prefets="sousPrefetOptions"
          :import-result="localiteImportResult"
          :loading="getTerritoryLoading()"
          :error="getTerritoryError()"
          :can-manage="canManageAdminModules"
          @reset-filters="resetTerritoryFilters"
          @view-region="openRegionDetails"
          @edit-region="openEditRegion"
          @toggle-region-status="toggleRegionStatus"
          @delete-region="confirmDeleteRegion"
          @view-departement="openDepartementDetails"
          @edit-departement="openEditDepartement"
          @toggle-departement-status="toggleDepartementStatus"
          @delete-departement="confirmDeleteDepartement"
          @view-sous-prefecture="openSousPrefectureDetails"
          @edit-sous-prefecture="openEditSousPrefecture"
          @toggle-sous-prefecture-status="toggleSousPrefectureStatus"
          @delete-sous-prefecture="confirmDeleteSousPrefecture"
          @view-localite="openLocaliteDetails"
          @edit-localite="openEditLocalite"
          @toggle-localite-status="toggleLocaliteStatus"
          @delete-localite="confirmDeleteLocalite"
        />
      </main>
    </div>

    <ValidationFormDialog
      v-model:visible="formDialogVisible"
      :validation="selectedValidation"
      :loading="validationsLoading"
      @save="saveValidation"
    />

    <ValidationDetailsDialog
      v-model:visible="detailsDialogVisible"
      :validation="selectedValidation"
    />

    <PaiementFormDialog
      v-model:visible="paiementFormDialogVisible"
      :paiement="selectedPaiement"
      :projets="projets"
      :prestataires="prestataires"
      :validations="validations"
      :loading="paiementsLoading || projetsLoading || prestatairesLoading || validationsLoading"
      @save="savePaiement"
    />

    <PaiementDetailsDialog
      v-model:visible="paiementDetailsDialogVisible"
      :paiement="selectedPaiement"
      :validations="validations"
    />

    <PtFormDialog
      v-model:visible="programmeFormDialogVisible"
      :programme="selectedProgramme"
      :loading="programmesLoading"
      @save="saveProgramme"
    />

    <PtDetailsDialog
      v-model:visible="programmeDetailsDialogVisible"
      :programme="selectedProgramme"
    />

    <ProjetFormDialog
      v-model:visible="projetFormDialogVisible"
      :projet="selectedProjet"
      :programmes="programmes"
      :types-intervention="typesIntervention"
      :prestataires="prestataires"
      :localites="localites"
      :loading="projetsLoading || programmesLoading || typesInterventionLoading || prestatairesLoading || localitesLoading"
      @save="saveProjet"
    />

    <ProjetDetailsDialog
      v-model:visible="projetDetailsDialogVisible"
      :projet="selectedProjet"
    />

    <ProjetLocaliteFormDialog
      v-model:visible="projetLocaliteFormDialogVisible"
      :projets="projets"
      :localites="localites"
      :loading="projetLocalitesLoading || projetsLoading || localitesLoading"
      @save="saveProjetLocalite"
    />

    <ProjetLocaliteDetailsDialog
      v-model:visible="projetLocaliteDetailsDialogVisible"
      :projet-localite="selectedProjetLocalite"
    />

    <AlerteTerrainFormDialog
      v-model:visible="alerteTerrainFormDialogVisible"
      :projet-localites="projetLocalites"
      :loading="alertesTerrainLoading || projetLocalitesLoading"
      @save="saveAlerteTerrain"
    />

    <AlerteTerrainTraitementDialog
      v-model:visible="alerteTerrainTraitementDialogVisible"
      :alerte="selectedAlerteTerrain"
      :loading="alertesTerrainLoading"
      @save="saveAlerteTerrainTraitement"
    />

    <AlerteTerrainDetailsDialog
      v-model:visible="alerteTerrainDetailsDialogVisible"
      :alerte="selectedAlerteTerrain"
    />

    <VisiteTerrainFormDialog
      v-model:visible="visiteTerrainFormDialogVisible"
      :visite="selectedVisiteTerrain"
      :projet-localites="projetLocalites"
      :loading="visitesTerrainLoading || projetLocalitesLoading"
      @save="saveVisiteTerrain"
    />

    <VisiteTerrainDetailsDialog
      v-model:visible="visiteTerrainDetailsDialogVisible"
      :visite="selectedVisiteTerrain"
    />

    <CahierChargesFormDialog
      v-model:visible="cahierChargesFormDialogVisible"
      :cahier="selectedCahierCharges"
      :types-intervention="typesIntervention"
      :loading="cahiersChargesLoading"
      @save="saveCahierCharges"
    />

    <CahierChargesDetailsDialog
      v-model:visible="cahierChargesDetailsDialogVisible"
      :cahier="selectedCahierCharges"
    />

    <DomaineInterventionFormDialog
      v-model:visible="domaineInterventionFormDialogVisible"
      :domaine="selectedDomaineIntervention"
      :loading="domainesInterventionLoading"
      @save="saveDomaineIntervention"
    />

    <DomaineInterventionDetailsDialog
      v-model:visible="domaineInterventionDetailsDialogVisible"
      :domaine="selectedDomaineIntervention"
    />

    <TypeInterventionFormDialog
      v-model:visible="typeInterventionFormDialogVisible"
      :type-intervention="selectedTypeIntervention"
      :domaines="domainesIntervention"
      :loading="typesInterventionLoading"
      @save="saveTypeIntervention"
    />

    <TypeInterventionDetailsDialog
      v-model:visible="typeInterventionDetailsDialogVisible"
      :type-intervention="selectedTypeIntervention"
    />

    <PrestataireFormDialog
      v-model:visible="prestataireFormDialogVisible"
      :prestataire="selectedPrestataire"
      :loading="prestatairesLoading"
      @save="savePrestataire"
    />

    <PrestataireDetailsDialog
      v-model:visible="prestataireDetailsDialogVisible"
      :prestataire="selectedPrestataire"
    />

    <UserFormDialog
      v-model:visible="userFormDialogVisible"
      :user="selectedUser"
      :loading="usersLoading"
      @save="saveUser"
    />

    <UserDetailsDialog
      v-model:visible="userDetailsDialogVisible"
      :user="selectedUser"
      :sous-prefectures="sousPrefectures"
      :departements="departements"
      :localites="localites"
      :editable="currentUserDetailsEditable"
      @edit="openCurrentUserProfileForm"
    />

    <UserProfileFormDialog
      v-model:visible="userProfileFormDialogVisible"
      :user="user"
      :loading="authStore.loading"
      @save="saveCurrentUserProfile"
    />

    <RegionFormDialog
      v-model:visible="regionFormDialogVisible"
      :region="selectedRegion"
      :localites="localites"
      :loading="regionsLoading"
      @save="saveRegion"
    />

    <RegionDetailsDialog
      v-model:visible="regionDetailsDialogVisible"
      :region="selectedRegion"
      :localites="localites"
    />

    <DepartementFormDialog
      v-model:visible="departementFormDialogVisible"
      :departement="selectedDepartement"
      :regions="regions"
      :localites="localites"
      :loading="departementsLoading"
      @save="saveDepartement"
    />

    <DepartementDetailsDialog
      v-model:visible="departementDetailsDialogVisible"
      :departement="selectedDepartement"
      :regions="regions"
      :localites="localites"
    />

    <SousPrefectureFormDialog
      v-model:visible="sousPrefectureFormDialogVisible"
      :sous-prefecture="selectedSousPrefecture"
      :departements="departements"
      :localites="localites"
      :sous-prefets="sousPrefetOptions"
      :loading="sousPrefecturesLoading"
      @save="saveSousPrefecture"
    />

    <SousPrefectureDetailsDialog
      v-model:visible="sousPrefectureDetailsDialogVisible"
      :sous-prefecture="selectedSousPrefecture"
      :departements="departements"
      :localites="localites"
      :sous-prefets="sousPrefetOptions"
    />

    <LocaliteFormDialog
      v-model:visible="localiteFormDialogVisible"
      :localite="selectedLocalite"
      :sous-prefectures="sousPrefectures"
      :loading="localitesLoading"
      @save="saveLocalite"
    />

    <LocaliteDetailsDialog
      v-model:visible="localiteDetailsDialogVisible"
      :localite="selectedLocalite"
      :sous-prefectures="sousPrefectures"
      :departements="departements"
    />

    <AffectationConseillerFormDialog
      v-model:visible="affectationConseillerDialogVisible"
      :conseiller-id="selectedConseillerAffectationId"
      :users="users"
      :localites="localites"
      :affectations="conseillerLocalites"
      :loading="affectationsLoading"
      @save="saveConseillerAffectation"
    />

    <AffectationVPFormDialog
      v-model:visible="affectationVPDialogVisible"
      :vp-id="selectedVPAffectationId"
      :users="users"
      :departements="departements"
      :affectations="vpDepartements"
      :loading="affectationsLoading"
      @save="saveVPAffectation"
    />

    <AffectationConseillerDetailsDialog
      v-model:visible="affectationConseillerDetailsVisible"
      :affectations="selectedConseillerAffectations"
    />

    <AffectationVPDetailsDialog
      v-model:visible="affectationVPDetailsVisible"
      :affectations="selectedVPAffectations"
    />
  </div>
</template>

<style>
@import '../assets/css/dashboard.css';
</style>
