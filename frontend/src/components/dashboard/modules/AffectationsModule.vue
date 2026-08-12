<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import type { ConseillerAffectationGroup, VPAffectationGroup } from '@/types/affectation'

const activeTab = defineModel<'conseillers' | 'vp'>('activeTab', { required: true })
const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  conseillerGroups: ConseillerAffectationGroup[]
  vpGroups: VPAffectationGroup[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  viewConseiller: [affectation: ConseillerAffectationGroup]
  editConseiller: [affectation: ConseillerAffectationGroup]
  viewVP: [affectation: VPAffectationGroup]
  editVP: [affectation: VPAffectationGroup]
}>()

const affectationTabs = [
  { label: 'Conseillers localités', value: 'conseillers' },
  { label: 'VP départements', value: 'vp' },
] as const
</script>

<template>
  <section class="surface-card table-shell">
    <div class="territory-tabs" role="tablist" aria-label="Types d'affectations">
      <button
        v-for="tab in affectationTabs"
        :key="tab.value"
        type="button"
        class="territory-tab"
        :class="{ 'is-active': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText
              v-model="globalSearch"
              placeholder="Rechercher"
              aria-label="Rechercher une affectation"
            />
          </span>
        </div>
      </template>

      <template #end>
        <div class="toolbar-actions">
          <Button
            icon="pi pi-refresh"
            label="Actualiser"
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
      v-if="activeTab === 'conseillers'"
      v-model:filters="filters"
      :value="conseillerGroups"
      :loading="loading"
      :global-filter-fields="['conseiller_nom', 'conseiller_email', 'localite_noms']"
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
          <span>Aucune affectation conseiller trouvée</span>
        </div>
      </template>

      <Column field="conseiller_nom" header="Conseiller" sortable />
      <Column field="conseiller_email" header="Email" sortable />
      <Column field="localite_noms" header="Localités" sortable />
      <Column header="Nombre" sortable>
        <template #body="{ data }">
          <Tag :value="String(data.affectations.length)" severity="info" />
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
              aria-label="Voir l'affectation du conseiller"
              @click="emit('viewConseiller', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier les localités du conseiller"
              @click="emit('editConseiller', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <DataTable
      v-else
      v-model:filters="filters"
      :value="vpGroups"
      :loading="loading"
      :global-filter-fields="['vice_president_nom', 'vice_president_email', 'departement_noms']"
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
          <span>Aucune affectation VP trouvée</span>
        </div>
      </template>

      <Column field="vice_president_nom" header="Vice-président" sortable />
      <Column field="vice_president_email" header="Email" sortable />
      <Column field="departement_noms" header="Départements" sortable />
      <Column header="Nombre" sortable>
        <template #body="{ data }">
          <Tag :value="String(data.affectations.length)" severity="info" />
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
              aria-label="Voir l'affectation du VP"
              @click="emit('viewVP', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier les départements du VP"
              @click="emit('editVP', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
