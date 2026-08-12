<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import { getBackendFileUrl } from '@/services/api'
import type { CahierCharges } from '@/types/cahierCharges'
import type { TypeIntervention } from '@/types/typeIntervention'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })
const selectedTypeIntervention = defineModel<string | null>('selectedTypeIntervention', { required: true })
const selectedActif = defineModel<boolean | null>('selectedActif', { required: true })

defineProps<{
  cahiers: CahierCharges[]
  typesIntervention: TypeIntervention[]
  loading: boolean
  error: string | null
  actifOptions: Array<{ label: string; value: boolean }>
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [cahier: CahierCharges]
  edit: [cahier: CahierCharges]
  delete: [cahier: CahierCharges]
}>()

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
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
              aria-label="Rechercher un cahier des charges"
            />
          </span>

          <Select
            v-model="selectedTypeIntervention"
            :options="typesIntervention"
            option-label="nom"
            option-value="id"
            placeholder="Type d'intervention"
            show-clear
            class="filter-select"
          />

          <Select
            v-model="selectedActif"
            :options="actifOptions"
            option-label="label"
            option-value="value"
            placeholder="Statut"
            show-clear
            class="filter-select"
          />
        </div>
      </template>

      <template #end>
        <div class="toolbar-actions">
          <Button
            icon="pi pi-refresh"
            label="Rafraîchir"
            severity="secondary"
            outlined
            :loading="loading"
            @click="emit('refresh')"
          />
          <Button
            icon="pi pi-filter-slash"
            label="Réinitialiser"
            severity="secondary"
            outlined
            @click="emit('resetFilters')"
          />
        </div>
      </template>
    </Toolbar>

    <DataTable
      v-model:filters="filters"
      :value="cahiers"
      :loading="loading"
      :global-filter-fields="['type_intervention_nom', 'version', 'fichier_pdf']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      filter-display="menu"
      striped-rows
      removable-sort
      table-style="min-width: 72rem"
    >
      <template #header>
        <p v-if="error" class="table-error" role="alert">
          {{ error }}
        </p>
      </template>

      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox" />
          <span>Aucun cahier des charges trouvé</span>
        </div>
      </template>

      <Column field="type_intervention_nom" header="Type d'intervention" sortable />
      <Column field="version" header="Version" sortable />
      <Column field="date_upload" header="Date upload" sortable>
        <template #body="{ data }">
          {{ formatDate(data.date_upload) }}
        </template>
      </Column>
      <Column field="actif" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value="data.actif ? 'Actif' : 'Inactif'" :severity="data.actif ? 'success' : 'danger'" />
        </template>
      </Column>
      <Column field="fichier_pdf" header="Fichier" sortable>
        <template #body="{ data }">
          <a v-if="data.fichier_pdf" :href="getBackendFileUrl(data.fichier_pdf)" target="_blank" rel="noreferrer">
            Voir le fichier
          </a>
          <span v-else>-</span>
        </template>
      </Column>
      <Column field="created_at" header="Créé le" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
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
              aria-label="Voir le cahier des charges"
              @click="emit('view', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier le cahier des charges"
              @click="emit('edit', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              aria-label="Supprimer le cahier des charges"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
