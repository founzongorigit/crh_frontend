<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import Tag from 'primevue/tag'
import type { Departement } from '@/types/territoires/departement'
import type { Localite, TypeLocalite } from '@/types/territoires/localite'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })

const props = defineProps<{
  localites: Localite[]
  sousPrefectures: SousPrefecture[]
  departements: Departement[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  view: [localite: Localite]
  edit: [localite: Localite]
  toggleStatus: [localite: Localite]
  delete: [localite: Localite]
}>()

const typeLocaliteLabels: Record<TypeLocalite, string> = {
  village: 'Village',
  campement: 'Campement',
  ville: 'Ville',
  canton: 'Canton',
  autre: 'Autre',
}

const formatTypeLocalite = (type: TypeLocalite) => typeLocaliteLabels[type]

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const getDepartementNom = (id: string) =>
  props.departements.find((departement) => departement.id === id)?.nom ?? id

const getSousPrefectureNom = (id: string) =>
  props.sousPrefectures.find((sousPrefecture) => sousPrefecture.id === id)?.nom ?? id
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="localites"
    :loading="loading"
    :global-filter-fields="['nom', 'type', 'sous_prefecture_id', 'departement_id']"
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
      <p v-if="error" class="table-error" role="alert">{{ error }}</p>
    </template>

    <template #empty>
      <div class="empty-state">
        <i class="pi pi-inbox" />
        <span>Aucune localité trouvée</span>
      </div>
    </template>

    <Column field="nom" header="Nom" sortable />
    <Column field="type" header="Type" sortable>
      <template #body="{ data }">
        <Tag :value="formatTypeLocalite(data.type)" severity="info" />
      </template>
    </Column>
    <Column field="sous_prefecture_id" header="Sous-préfecture" sortable>
      <template #body="{ data }">{{ getSousPrefectureNom(data.sous_prefecture_id) }}</template>
    </Column>
    <Column field="departement_id" header="Département" sortable>
      <template #body="{ data }">{{ getDepartementNom(data.departement_id) }}</template>
    </Column>
    <Column field="is_active" header="Statut" sortable>
      <template #body="{ data }">
        <Tag :value="data.is_active ? 'Actif' : 'Inactif'" :severity="data.is_active ? 'success' : 'danger'" />
      </template>
    </Column>
    <Column field="created_at" header="Date création" sortable>
      <template #body="{ data }">{{ formatDate(data.created_at) }}</template>
    </Column>
    <Column field="updated_at" header="Date modification" sortable>
      <template #body="{ data }">{{ formatDate(data.updated_at) }}</template>
    </Column>
    <Column header="Actions" class="actions-column">
      <template #body="{ data }">
        <div class="row-actions">
          <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir la localité" @click="emit('view', data)" />
          <Button v-if="canManage" icon="pi pi-pencil" severity="secondary" text rounded aria-label="Modifier la localité" @click="emit('edit', data)" />
          <Button
            v-if="canManage"
            :icon="data.is_active ? 'pi pi-lock' : 'pi pi-lock-open'"
            :severity="data.is_active ? 'warning' : 'success'"
            text
            rounded
            aria-label="Changer le statut"
            @click="emit('toggleStatus', data)"
          />
          <Button v-if="canManage" icon="pi pi-trash" severity="danger" text rounded aria-label="Supprimer la localité" @click="emit('delete', data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
