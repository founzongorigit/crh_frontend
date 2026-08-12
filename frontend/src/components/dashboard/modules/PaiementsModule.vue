<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import { getBackendFileUrl } from '@/services/api'
import type { Paiement, TypeReglement } from '@/types/paiement'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })
const selectedTypeReglement = defineModel<TypeReglement | null>('selectedTypeReglement', {
  required: true,
})

defineProps<{
  paiements: Paiement[]
  loading: boolean
  error: string | null
  typeReglementOptions: Array<{ label: string; value: TypeReglement }>
  canManage: boolean
}>()

const emit = defineEmits<{
  resetFilters: []
  view: [paiement: Paiement]
  edit: [paiement: Paiement]
  delete: [paiement: Paiement]
}>()

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

const formatTypeReglement = (typeReglement: TypeReglement) => {
  if (typeReglement === 'TOTAL') return 'Total'

  return 'Partiel'
}

const getTypeReglementSeverity = (typeReglement: TypeReglement) => {
  if (typeReglement === 'TOTAL') return 'success'

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
            <InputText
              v-model="globalSearch"
              placeholder="Rechercher"
              aria-label="Rechercher un paiement"
            />
          </span>

          <Select
            v-model="selectedTypeReglement"
            :options="typeReglementOptions"
            option-label="label"
            option-value="value"
            placeholder="Type"
            show-clear
            class="filter-select"
          />
        </div>
      </template>

      <template #end>
        <div class="toolbar-actions">
          <Button
            icon="pi pi-filter-slash"
            label="Réinitialiser"
            severity="secondary"
            outlined
            @click="emit('resetFilters')"
          />
          <Button icon="pi pi-download" label="Exporter" severity="secondary" outlined />
        </div>
      </template>
    </Toolbar>

    <DataTable
      v-model:filters="filters"
      :value="paiements"
      :loading="loading"
      :global-filter-fields="[
        'projet_libelle',
        'prestataire_nom',
        'montant',
        'type_reglement',
        'reference_mandatement',
      ]"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      filter-display="menu"
      striped-rows
      removable-sort
      table-style="min-width: 64rem"
    >
      <template #header>
        <p v-if="error" class="table-error" role="alert">
          {{ error }}
        </p>
      </template>

      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox" />
          <span>Aucun paiement trouvé</span>
        </div>
      </template>

      <Column field="projet_libelle" header="Projet" sortable />
      <Column field="prestataire_nom" header="Prestataire" sortable />

      <Column field="montant" header="Montant" sortable>
        <template #body="{ data }">
          {{ formatMontant(data.montant) || '-' }}
        </template>
      </Column>

      <Column field="type_reglement" header="Type" sortable>
        <template #body="{ data }">
          <Tag
            :value="formatTypeReglement(data.type_reglement)"
            :severity="getTypeReglementSeverity(data.type_reglement)"
          />
        </template>
      </Column>

      <Column field="reference_mandatement" header="Référence" sortable>
        <template #body="{ data }">
          {{ data.reference_mandatement || '-' }}
        </template>
      </Column>

      <Column field="justificatif" header="Justificatif" sortable>
        <template #body="{ data }">
          <a v-if="data.justificatif" :href="getBackendFileUrl(data.justificatif)" target="_blank" rel="noreferrer">
            Document
          </a>
          <span v-else>-</span>
        </template>
      </Column>

      <Column field="date_paiement" header="Date paiement" sortable>
        <template #body="{ data }">
          {{ formatDate(data.date_paiement) || '-' }}
        </template>
      </Column>

      <Column field="created_at" header="Date création" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) || '-' }}
        </template>
      </Column>

      <Column field="updated_at" header="Date modification" sortable>
        <template #body="{ data }">
          {{ formatDate(data.updated_at) || '-' }}
        </template>
      </Column>

      <Column header="Actions" class="actions-column">
        <template #body="{ data }">
          <div class="row-actions">
            <Button
              icon="pi pi-eye"
              severity="info"
              text
              rounded
              aria-label="Voir le paiement"
              @click="emit('view', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier le paiement"
              @click="emit('edit', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              aria-label="Supprimer le paiement"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
