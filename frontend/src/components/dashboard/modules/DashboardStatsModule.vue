<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardModule } from '@/components/dashboard/config/dashboardModules'
import type {
  AffectationConseillerLocalite,
  AffectationVPDepartement,
} from '@/types/affectation'
import type { ActivityLog } from '@/types/activityLog'
import type { AlerteTerrain } from '@/types/alerteTerrain'
import type { CahierCharges } from '@/types/cahierCharges'
import type { DomaineIntervention } from '@/types/domaineIntervention'
import type { Paiement } from '@/types/paiement'
import type { Prestataire } from '@/types/prestataire'
import type { Projet } from '@/types/projet'
import type { ProjetLocalite } from '@/types/projetLocalite'
import type { ProgrammeTriennal } from '@/types/pt'
import type { Localite } from '@/types/territoires/localite'
import type { TypeIntervention } from '@/types/typeIntervention'
import type { User } from '@/types/user'
import type { Validation } from '@/types/validation'
import type { VisiteTerrain } from '@/types/visiteTerrain'

const props = defineProps<{
  modules: DashboardModule[]
  programmes: ProgrammeTriennal[]
  projets: Projet[]
  projetLocalites: ProjetLocalite[]
  alertesTerrain: AlerteTerrain[]
  visitesTerrain: VisiteTerrain[]
  cahiersCharges: CahierCharges[]
  validations: Validation[]
  paiements: Paiement[]
  prestataires: Prestataire[]
  users: User[]
  localites: Localite[]
  domainesIntervention: DomaineIntervention[]
  typesIntervention: TypeIntervention[]
  conseillerLocalites: AffectationConseillerLocalite[]
  vpDepartements: AffectationVPDepartement[]
  activityLogs: ActivityLog[]
  loading?: boolean
}>()

const emit = defineEmits<{
  selectModule: [moduleLabel: string]
}>()

const getModuleIcon = (label: string) =>
  props.modules.find((module) => module.label === label)?.icon ?? 'pi pi-chart-bar'

const stats = computed(() => {
  const visibleModuleLabels = new Set(props.modules.map((module) => module.label))

  return [
  {
    label: 'Programmes triennaux',
    icon: getModuleIcon('Programmes triennaux'),
    value: props.programmes.length,
    detail: 'programmes suivis',
    color: 'orange',
  },
  {
    label: 'Projets',
    icon: getModuleIcon('Projets'),
    value: props.projets.length,
    detail: `${props.projets.filter((projet) => projet.statut === 'EN_COURS').length} en cours`,
    color: 'orange',
  },
  {
    label: 'Projet localités',
    icon: getModuleIcon('Projet localités'),
    value: props.projetLocalites.length,
    detail: 'localités liées aux projets',
    color: 'orange',
  },
  {
    label: 'Alertes terrain',
    icon: getModuleIcon('Alertes terrain'),
    value: props.alertesTerrain.length,
    detail: `${props.alertesTerrain.filter((alerte) => alerte.statut_traitement !== 'TRAITE').length} à traiter`,
    color: 'orange',
  },
  {
    label: 'Visites terrain',
    icon: getModuleIcon('Visites terrain'),
    value: props.visitesTerrain.length,
    detail: 'visites enregistrées',
    color: 'orange',
  },
  {
    label: 'Cahiers des charges',
    icon: getModuleIcon('Cahiers des charges'),
    value: props.cahiersCharges.length,
    detail: 'documents disponibles',
    color: 'orange',
  },
  {
    label: 'Validations',
    icon: getModuleIcon('Validations'),
    value: props.validations.length,
    detail: `${props.validations.filter((validation) => validation.statut === 'EN_ATTENTE').length} en attente`,
    color: 'orange',
  },
  {
    label: 'Paiements',
    icon: getModuleIcon('Paiements'),
    value: props.paiements.length,
    detail: 'paiements enregistrés',
    color: 'orange',
  },
  {
    label: 'Prestataires',
    icon: getModuleIcon('Prestataires'),
    value: props.prestataires.length,
    detail: 'prestataires référencés',
    color: 'orange',
  },
  {
    label: 'Utilisateurs',
    icon: getModuleIcon('Utilisateurs'),
    value: props.users.length,
    detail: `${props.users.filter((user) => user.is_active).length} actifs`,
    color: 'orange',
  },
  {
    label: 'Territoires',
    icon: getModuleIcon('Territoires'),
    value: props.localites.length,
    detail: 'localités enregistrées',
    color: 'orange',
  },
  {
    label: 'Affectations',
    icon: getModuleIcon('Affectations'),
    value: props.conseillerLocalites.length + props.vpDepartements.length,
    detail: `${props.conseillerLocalites.length} localités, ${props.vpDepartements.length} départements`,
    color: 'orange',
  },
  {
    label: 'Domaines d\'intervention',
    icon: getModuleIcon('Domaines d\'intervention'),
    value: props.domainesIntervention.length,
    detail: 'domaines configurés',
    color: 'orange',
  },
  {
    label: 'Types d\'intervention',
    icon: getModuleIcon('Types d\'intervention'),
    value: props.typesIntervention.length,
    detail: 'types configurés',
    color: 'orange',
  },
  {
    label: 'Journal d\'activités',
    icon: getModuleIcon('Journal d\'activités'),
    value: props.activityLogs.length,
    detail: 'actions enregistrées',
    color: 'orange',
  },
  ].filter((stat) => visibleModuleLabels.has(stat.label))
})
</script>

<template>
  <section class="stats-module" aria-label="Statistiques du tableau de bord">
    <div class="stats-grid">
      <button
        v-for="stat in stats"
        :key="stat.label"
        type="button"
        class="stat-card"
        @click="emit('selectModule', stat.label)"
      >
        <span class="stat-icon">
          <i :class="stat.icon" :style="{ color: stat.color }" />
        </span>
        <span class="stat-content">
          <span class="stat-label">{{ stat.label }}</span>
          <strong>{{ loading ? '...' : stat.value }}</strong>
          <span class="stat-detail">{{ loading ? 'Chargement' : stat.detail }}</span>
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.stats-module {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.stat-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem;
  align-items: center;
  min-height: 7.25rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.stat-card:hover {
  border-color: #94a3b8;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.stat-icon {
  display: inline-grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 8px;
  background: #eff6ff;
  color: orange;
}

.stat-icon i {
  font-size: 1.2rem;
}

.stat-content {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.stat-label {
  color: #475569;
  font-size: 0.82rem;
  font-weight: 800;
}

.stat-content strong {
  color: #0f172a;
  font-size: 1.85rem;
  line-height: 1;
}

.stat-detail {
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}
</style>
