<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import type { VisiteTerrain } from '@/types/visiteTerrain'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  visites: VisiteTerrain[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [visite: VisiteTerrain]
  edit: [visite: VisiteTerrain]
  delete: [visite: VisiteTerrain]
}>()

const statutLabels: Record<string, string> = {
  NON_DEMARRE: 'Non démarré',
  EN_COURS: 'En cours',
  SUSPENDU: 'Suspendu',
  ACHEVE: 'Achevé',
}

const getTraitementSeverity = (traitement: VisiteTerrain['statut_constate']) => {
  if (traitement === 'NON_DEMARRE') return 'secondary'
  if (traitement === 'EN_COURS') return 'warn'
  if (traitement === 'SUSPENDU') return 'danger'
  if (traitement === 'ACHEVE') return 'success'

  return 'secondary'
}
const formatStatut = (statut: VisiteTerrain['statut_constate']) => {
  if (!statut) return '-'

  return statutLabels[statut] ?? statut
}

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))
</script>

<template>
  <section class="surface-card table-shell">
    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText v-model="globalSearch" placeholder="Rechercher" aria-label="Rechercher une visite" />
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
      :value="visites"
      :loading="loading"
      :global-filter-fields="['projet_libelle', 'localite_nom', 'visiteur_email', 'observations', 'statut_constate']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      striped-rows
      removable-sort
      table-style="min-width: 78rem"
    >
      <template #header><p v-if="error" class="table-error" role="alert">{{ error }}</p></template>
      <template #empty><div class="empty-state"><i class="pi pi-inbox" /><span>Aucune visite trouvée</span></div></template>

      <Column field="projet_libelle" header="Projet" sortable />
      <Column field="localite_nom" header="Localité" sortable>
        <template #body="{ data }">{{ data.localite_nom || '-' }}</template>
      </Column>
      <Column field="visiteur_email" header="Visiteur" sortable />
      <Column field="taux_constate" header="Taux constaté" sortable>
        <template #body="{ data }">{{ data.taux_constate }}%</template>
      </Column>
      <Column field="statut_constate" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value=" formatStatut(data.statut_constate)" 
               :severity="getTraitementSeverity(data.statut_constate)" />
        </template>
      </Column>
      <Column field="date_visite" header="Date visite" sortable>
        <template #body="{ data }">{{ formatDate(data.date_visite) }}</template>
      </Column>
      <Column header="Actions" class="actions-column">
        <template #body="{ data }">
          <div class="row-actions">
            <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir" @click="emit('view', data)" />
            <Button v-if="canManage" icon="pi pi-pencil" severity="secondary" text rounded aria-label="Modifier" @click="emit('edit', data)" />
            <Button v-if="canManage" icon="pi pi-trash" severity="danger" text rounded aria-label="Supprimer" @click="emit('delete', data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
