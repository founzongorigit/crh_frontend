<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import type { ProgrammeTriennal } from '@/types/pt'
import Tag from 'primevue/tag'
const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  programmes: ProgrammeTriennal[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [programme: ProgrammeTriennal]
  edit: [programme: ProgrammeTriennal]
  delete: [programme: ProgrammeTriennal]
}>()

const formatMontant = (montant: ProgrammeTriennal['budget_total']) =>
  new Intl.NumberFormat('fr-FR').format(Number(montant))

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))

const statutLabels: Record<string, string> = {
  EN_PREPARATION: 'En préparation',
  ACTIF: 'Actif',
  CLOS: 'Clos',
}

const getTraitementSeverity = (progamme: ProgrammeTriennal['statut']) => {
  if (progamme === 'EN_PREPARATION') return 'warn'
  if (progamme === 'ACTIF') return 'success'

  return 'info'
}

const formatStatut = (statut: ProgrammeTriennal['statut']) => statutLabels[statut] ?? statut
</script>

<template>
  <section class="surface-card table-shell">
    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText v-model="globalSearch" placeholder="Rechercher" aria-label="Rechercher un programme" />
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
      :value="programmes"
      :loading="loading"
      :global-filter-fields="['libelle', 'statut']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      striped-rows
      removable-sort
      table-style="min-width: 64rem"
    >
      <template #header><p v-if="error" class="table-error" role="alert">{{ error }}</p></template>
      <template #empty><div class="empty-state"><i class="pi pi-inbox" /><span>Aucun programme trouvé</span></div></template>

      <Column field="libelle" header="Libellé" sortable />
      <Column field="annee_debut" header="Début" sortable />
      <Column field="annee_fin" header="Fin" sortable />
      <Column field="budget_total" header="Budget" sortable>
        <template #body="{ data }">{{ formatMontant(data.budget_total) }}</template>
      </Column>
      <Column field="statut" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value="formatStatut(data.statut)" 
               :severity="getTraitementSeverity(data.statut)" />
        </template>
      </Column>
      <Column field="created_at" header="Créé le" sortable>
        <template #body="{ data }">{{ formatDate(data.created_at) }}</template>
      </Column>
      <Column header="Actions" class="actions-column">
        <template #body="{ data }">
          <div class="row-actions">
            <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir" @click="emit('view', data)" />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier"
              @click="emit('edit', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              aria-label="Supprimer"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
