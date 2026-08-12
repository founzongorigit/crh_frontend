<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import type { AlerteTerrain } from '@/types/alerteTerrain'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  alertes: AlerteTerrain[]
  loading: boolean
  error: string | null
  canManage: boolean
  canTreat: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [alerte: AlerteTerrain]
  edit: [alerte: AlerteTerrain]
  delete: [alerte: AlerteTerrain]
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))

const urgenceLabels: Record<string, string> = {
  INFO: 'Info',
  MOYEN: 'Moyen',
  URGENT: 'Urgent',
}

const traitementLabels: Record<string, string> = {
  NON_TRAITE: 'Non traité',
  EN_COURS: 'En cours',
  TRAITE: 'Traité',
}

const formatUrgence = (urgence: AlerteTerrain['niveau_urgence']) =>
  urgenceLabels[urgence] ?? urgence

const formatTraitement = (traitement: AlerteTerrain['statut_traitement']) =>
  traitementLabels[traitement] ?? traitement

const canTreatAlerte = (alerte: AlerteTerrain) => alerte.statut_traitement === 'NON_TRAITE' || alerte.statut_traitement === 'EN_COURS'

const getTraitementSeverity = (traitement: AlerteTerrain['statut_traitement']) => {
  if (traitement === 'TRAITE') return 'success'
  if (traitement === 'EN_COURS') return 'warn'

  return 'danger'
}

const getUrgenceSeverity = (urgence: AlerteTerrain['niveau_urgence']) => {
  if (urgence === 'URGENT') return 'danger'
  if (urgence === 'MOYEN') return 'warn'

  return 'info'
}

</script>

<template>
  <section class="surface-card table-shell">
    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText v-model="globalSearch" placeholder="Rechercher" aria-label="Rechercher une alerte" />
          </span>
        </div>
      </template>
      <template #end>
        <div class="toolbar-actions">
          <Button icon="pi pi-refresh" label="Rafraîchir" severity="secondary" outlined :loading="loading" @click="emit('refresh')" />
          <Button icon="pi pi-filter-slash" label="Réinitialiser" severity="secondary" outlined @click="emit('resetFilters')" />
        </div>
      </template>
    </Toolbar>

    <DataTable
      v-model:filters="filters"
      :value="alertes"
      :loading="loading"
      :global-filter-fields="['projet_libelle', 'localite_nom', 'emetteur_email', 'message', 'niveau_urgence', 'statut_traitement']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      striped-rows
      removable-sort
      table-style="min-width: 78rem"
    >
      <template #header><p v-if="error" class="table-error" role="alert">{{ error }}</p></template>
      <template #empty><div class="empty-state"><i class="pi pi-inbox" /><span>Aucune alerte trouvée</span></div></template>

      <Column field="projet_libelle" header="Projet" sortable />
      <Column field="localite_nom" header="Localité" sortable />
      <Column field="emetteur_email" header="Émetteur" sortable />
      <Column field="niveau_urgence" header="Urgence" sortable>
        <template #body="{ data }">
          <Tag :value="formatUrgence(data.niveau_urgence)"
               :severity="getUrgenceSeverity(data.niveau_urgence)" />
        </template>
      </Column>
      <Column field="statut_traitement" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value="formatTraitement(data.statut_traitement)" 
               :severity="getTraitementSeverity(data.statut_traitement)" />
        </template>
      </Column>
      <Column field="date_emission" header="Émise le" sortable>
        <template #body="{ data }">{{ formatDate(data.date_emission) }}</template>
      </Column>
      <Column header="Actions" class="actions-column">
        <template #body="{ data }">
          <div class="row-actions">
            <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir" @click="emit('view', data)" />
            <Button v-if="canTreatAlerte(data) && canTreat" icon="pi pi-check-circle" severity="success" text rounded aria-label="Traiter" @click="emit('edit', data)" />
            <Button v-if="canManage" icon="pi pi-trash" severity="danger" text rounded aria-label="Supprimer" @click="emit('delete', data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
