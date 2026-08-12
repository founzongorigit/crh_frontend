<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import type { Profil, User } from '@/types/user'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })
const selectedProfil = defineModel<Profil | null>('selectedProfil', { required: true })
const selectedStatus = defineModel<boolean | null>('selectedStatus', { required: true })

defineProps<{
  users: User[]
  loading: boolean
  error: string | null
  profilOptions: Array<{ label: string; value: Profil }>
  statusOptions: Array<{ label: string; value: boolean }>
  canManage: boolean
}>()

const emit = defineEmits<{
  resetFilters: []
  view: [user: User]
  edit: [user: User]
  toggleStatus: [user: User]
  delete: [user: User]
}>()

const profilLabels: Record<Profil, string> = {
  CONSEILLER: 'Conseiller',
  VP: 'Vice-Président',
  PRESIDENT: 'Président',
  DG: 'Directeur Général',
  DGA: 'Directeur Général Adjoint',
  DT: 'Directeur Technique',
  DAF: 'DAF',
  SOUS_PREFET: 'Sous-préfet',
  ADMIN: 'Administrateur',
}

const formatProfil = (profil: Profil) => profilLabels[profil]

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
              aria-label="Rechercher un utilisateur"
            />
          </span>

          <Select
            v-model="selectedProfil"
            :options="profilOptions"
            option-label="label"
            option-value="value"
            placeholder="Profil"
            show-clear
            class="filter-select"
          />

          <Select
            v-model="selectedStatus"
            :options="statusOptions"
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
      :value="users"
      :loading="loading"
      :global-filter-fields="['nom', 'prenom', 'email', 'telephone', 'profil']"
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
          <span>Aucun utilisateur trouvé</span>
        </div>
      </template>

      <Column field="nom" header="Nom" sortable />
      <Column field="prenom" header="Prénom" sortable />
      <Column field="email" header="Email" sortable />

      <Column field="profil" header="Profil" sortable>
        <template #body="{ data }">
          <Tag :value="formatProfil(data.profil)" severity="info" />
        </template>
      </Column>

      <Column field="telephone" header="Téléphone" sortable>
        <template #body="{ data }">
          {{ data.telephone || '-' }}
        </template>
      </Column>

      <Column field="is_active" header="Statut" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.is_active ? 'Actif' : 'Inactif'"
            :severity="data.is_active ? 'success' : 'danger'"
          />
        </template>
      </Column>

      <Column field="photo_profile" header="Photo" sortable>
        <template #body="{ data }">
          {{ data.photo_profile || '-' }}
        </template>
      </Column>

      <Column field="created_at" header="Date création" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column field="updated_at" header="Date modification" sortable>
        <template #body="{ data }">
          {{ formatDate(data.updated_at) }}
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
              aria-label="Voir l'utilisateur"
              @click="emit('view', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              aria-label="Modifier l'utilisateur"
              @click="emit('edit', data)"
            />
            <Button
              v-if="canManage"
              :icon="data.is_active ? 'pi pi-lock' : 'pi pi-lock-open'"
              :severity="data.is_active ? 'warning' : 'success'"
              text
              rounded
              aria-label="Changer le statut"
              @click="emit('toggleStatus', data)"
            />
            <Button
              v-if="canManage"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              aria-label="Supprimer l'utilisateur"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
