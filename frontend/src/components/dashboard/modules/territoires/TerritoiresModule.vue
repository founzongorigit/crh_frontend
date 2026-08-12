<script setup lang="ts">
import Button from 'primevue/button'
import type { DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import DepartementsTable from './DepartementsTable.vue'
import LocalitesTable from './LocalitesTable.vue'
import RegionsTable from './RegionsTable.vue'
import SousPrefecturesTable from './SousPrefecturesTable.vue'
import type { Departement } from '@/types/territoires/departement'
import type { Localite, LocaliteImportResult } from '@/types/territoires/localite'
import type { Region } from '@/types/territoires/region'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'
import type { User } from '@/types/user'

type TerritoryTab = 'regions' | 'departements' | 'sousPrefectures' | 'localites'

const activeTab = defineModel<TerritoryTab>('activeTab', { required: true })
const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  regions: Region[]
  departements: Departement[]
  sousPrefectures: SousPrefecture[]
  localites: Localite[]
  sousPrefets: User[]
  importResult: LocaliteImportResult | null
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  resetFilters: []
  viewRegion: [region: Region]
  editRegion: [region: Region]
  toggleRegionStatus: [region: Region]
  deleteRegion: [region: Region]
  viewDepartement: [departement: Departement]
  editDepartement: [departement: Departement]
  toggleDepartementStatus: [departement: Departement]
  deleteDepartement: [departement: Departement]
  viewSousPrefecture: [sousPrefecture: SousPrefecture]
  editSousPrefecture: [sousPrefecture: SousPrefecture]
  toggleSousPrefectureStatus: [sousPrefecture: SousPrefecture]
  deleteSousPrefecture: [sousPrefecture: SousPrefecture]
  viewLocalite: [localite: Localite]
  editLocalite: [localite: Localite]
  toggleLocaliteStatus: [localite: Localite]
  deleteLocalite: [localite: Localite]
}>()

const territoryTabs = [
  { label: 'Régions', value: 'regions' },
  { label: 'Départements', value: 'departements' },
  { label: 'Sous-préfectures', value: 'sousPrefectures' },
  { label: 'Localités', value: 'localites' },
] as const
</script>

<template>
  <section class="surface-card table-shell">
    <div class="territory-tabs" role="tablist" aria-label="Types de territoires">
      <button
        v-for="tab in territoryTabs"
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
              aria-label="Rechercher un territoire"
            />
          </span>
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

    <p v-if="activeTab === 'localites' && importResult" class="table-error" role="status">
      {{ importResult.created }} localité(s) importée(s).
      <span v-if="importResult.errors.length">
        {{ importResult.errors.length }} erreur(s) dans le fichier.
      </span>
    </p>

    <RegionsTable
      v-if="activeTab === 'regions'"
      v-model:filters="filters"
      :regions="regions"
      :localites="localites"
      :loading="loading"
      :error="error"
      :can-manage="canManage"
      @view="emit('viewRegion', $event)"
      @edit="emit('editRegion', $event)"
      @toggle-status="emit('toggleRegionStatus', $event)"
      @delete="emit('deleteRegion', $event)"
    />

    <DepartementsTable
      v-else-if="activeTab === 'departements'"
      v-model:filters="filters"
      :departements="departements"
      :regions="regions"
      :localites="localites"
      :loading="loading"
      :error="error"
      :can-manage="canManage"
      @view="emit('viewDepartement', $event)"
      @edit="emit('editDepartement', $event)"
      @toggle-status="emit('toggleDepartementStatus', $event)"
      @delete="emit('deleteDepartement', $event)"
    />

    <SousPrefecturesTable
      v-else-if="activeTab === 'sousPrefectures'"
      v-model:filters="filters"
      :sous-prefectures="sousPrefectures"
      :departements="departements"
      :localites="localites"
      :sous-prefets="sousPrefets"
      :loading="loading"
      :error="error"
      :can-manage="canManage"
      @view="emit('viewSousPrefecture', $event)"
      @edit="emit('editSousPrefecture', $event)"
      @toggle-status="emit('toggleSousPrefectureStatus', $event)"
      @delete="emit('deleteSousPrefecture', $event)"
    />

    <LocalitesTable
      v-else
      v-model:filters="filters"
      :localites="localites"
      :sous-prefectures="sousPrefectures"
      :departements="departements"
      :loading="loading"
      :error="error"
      :can-manage="canManage"
      @view="emit('viewLocalite', $event)"
      @edit="emit('editLocalite', $event)"
      @toggle-status="emit('toggleLocaliteStatus', $event)"
      @delete="emit('deleteLocalite', $event)"
    />
  </section>
</template>
