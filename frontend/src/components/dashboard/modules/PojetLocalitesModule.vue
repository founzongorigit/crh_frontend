<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import type { ProjetLocalite } from '@/types/projetLocalite'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  projetLocalites: ProjetLocalite[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [projetLocalite: ProjetLocalite]
  toggleSuspension: [projetLocalite: ProjetLocalite]
  delete: [projetLocalite: ProjetLocalite]
}>()

const getStatutExecutionSeverity = (statut: ProjetLocalite['statut_execution']) => {
  if (statut === 'Achevé') return 'success'
  if (statut === 'En cours') return 'warn'
  if (statut === 'Suspendu') return 'danger'
  if (statut === 'Non démarré') return 'info'

  return 'secondary'
}
</script>

<template>
  <section class="surface-card table-shell">
    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText v-model="globalSearch" placeholder="Rechercher" aria-label="Rechercher une localité de projet" />
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
      :value="projetLocalites"
      :loading="loading"
      :global-filter-fields="['projet_libelle', 'nom', 'sous_prefecture_nom', 'departement_nom', 'statut_execution']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="projet_localite_id"
      striped-rows
      removable-sort
      table-style="min-width: 72rem"
    >
      <template #header><p v-if="error" class="table-error" role="alert">{{ error }}</p></template>
      <template #empty><div class="empty-state"><i class="pi pi-inbox" /><span>Aucune localité de projet trouvée</span></div></template>

      <Column field="projet_libelle" header="Projet" sortable />
      <Column field="nom" header="Localité" sortable />
      <Column field="sous_prefecture_nom" header="Sous-préfecture" sortable />
      <Column field="departement_nom" header="Département" sortable />
      <Column field="taux_realisation" header="Taux" sortable>
        <template #body="{ data }">{{ data.taux_realisation }}%</template>
      </Column>
      <Column field="statut_execution" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value="data.statut_execution" :severity="getStatutExecutionSeverity(data.statut_execution)" />
        </template>
      </Column>
      <Column header="Actions" class="actions-column">
        <template #body="{ data }">
          <div class="row-actions">
            <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir" @click="emit('view', data)" />
            <Button
              v-if="canManage"
              :icon="data.est_suspendu ? 'pi pi-play' : 'pi pi-pause'"
              :severity="data.est_suspendu ? 'success' : 'warning'"
              text
              rounded
              :aria-label="data.est_suspendu ? 'Reprendre' : 'Suspendre'"
              @click="emit('toggleSuspension', data)"
            />
            <Button v-if="canManage" icon="pi pi-times" severity="danger" text rounded aria-label="Retirer du projet" @click="emit('delete', data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
