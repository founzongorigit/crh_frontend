<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import type { Prestataire } from '@/types/prestataire'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  prestataires: Prestataire[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [prestataire: Prestataire]
  edit: [prestataire: Prestataire]
  delete: [prestataire: Prestataire]
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))
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
              aria-label="Rechercher un prestataire"
            />
          </span>
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
      :value="prestataires"
      :loading="loading"
      :global-filter-fields="[
        'raison_sociale',
        'num_id_fiscal',
        'siege',
        'telephone',
        'email',
        'representant',
      ]"
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
          <span>Aucun prestataire trouvé</span>
        </div>
      </template>

      <Column field="raison_sociale" header="Raison sociale" sortable />
      <Column field="num_id_fiscal" header="NIF" sortable>
        <template #body="{ data }">
          {{ data.num_id_fiscal || '-' }}
        </template>
      </Column>
      <Column field="siege" header="Siège" sortable>
        <template #body="{ data }">
          {{ data.siege || '-' }}
        </template>
      </Column>
      <Column field="telephone" header="Téléphone" sortable>
        <template #body="{ data }">
          {{ data.telephone || '-' }}
        </template>
      </Column>
      <Column field="email" header="Email" sortable>
        <template #body="{ data }">
          {{ data.email || '-' }}
        </template>
      </Column>
      <Column field="representant" header="Représentant" sortable>
        <template #body="{ data }">
          {{ data.representant || '-' }}
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
              aria-label="Voir le prestataire"
              @click="emit('view', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier le prestataire"
              @click="emit('edit', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              aria-label="Supprimer le prestataire"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
