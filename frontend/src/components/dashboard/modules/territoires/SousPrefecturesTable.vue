<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import Tag from 'primevue/tag'
import type { Departement } from '@/types/territoires/departement'
import type { Localite } from '@/types/territoires/localite'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'
import type { User } from '@/types/user'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })

const props = defineProps<{
  sousPrefectures: SousPrefecture[]
  departements: Departement[]
  localites: Localite[]
  sousPrefets: User[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  view: [sousPrefecture: SousPrefecture]
  edit: [sousPrefecture: SousPrefecture]
  toggleStatus: [sousPrefecture: SousPrefecture]
  delete: [sousPrefecture: SousPrefecture]
}>()

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const getDepartementNom = (id: string) =>
  props.departements.find((departement) => departement.id === id)?.nom ?? id

const getLocaliteNom = (id: string | null) => {
  if (!id) return '-'
  return props.localites.find((localite) => localite.id === id)?.nom ?? id
}

const getSousPrefetNom = (id: string | null) => {
  if (!id) return '-'
  const sousPrefet = props.sousPrefets.find((user) => user.id === id)
  return sousPrefet ? `${sousPrefet.prenom} ${sousPrefet.nom}`.trim() : id
}
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="sousPrefectures"
    :loading="loading"
    :global-filter-fields="['nom', 'departement_id', 'chef_lieu_id', 'sous_prefet_id']"
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
        <span>Aucune sous-préfecture trouvée</span>
      </div>
    </template>

    <Column field="nom" header="Nom" sortable />
    <Column field="departement_id" header="Département" sortable>
      <template #body="{ data }">{{ getDepartementNom(data.departement_id) }}</template>
    </Column>
    <Column field="chef_lieu_id" header="Chef-lieu" sortable>
      <template #body="{ data }">{{ getLocaliteNom(data.chef_lieu_id) }}</template>
    </Column>
    <Column field="sous_prefet_id" header="Sous-préfet" sortable>
      <template #body="{ data }">{{ getSousPrefetNom(data.sous_prefet_id) }}</template>
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
          <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir la sous-préfecture" @click="emit('view', data)" />
          <Button v-if="canManage" icon="pi pi-pencil" severity="secondary" text rounded aria-label="Modifier la sous-préfecture" @click="emit('edit', data)" />
          <Button
            v-if="canManage"
            :icon="data.is_active ? 'pi pi-lock' : 'pi pi-lock-open'"
            :severity="data.is_active ? 'warning' : 'success'"
            text
            rounded
            aria-label="Changer le statut"
            @click="emit('toggleStatus', data)"
          />
          <Button v-if="canManage" icon="pi pi-trash" severity="danger" text rounded aria-label="Supprimer la sous-préfecture" @click="emit('delete', data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
