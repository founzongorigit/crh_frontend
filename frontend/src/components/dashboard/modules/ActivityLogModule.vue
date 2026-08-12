<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import type { ActivityLog, ActivityLogAction } from '@/types/activityLog'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })
const selectedAction = defineModel<ActivityLogAction | null>('selectedAction', { required: true })

defineProps<{
  logs: ActivityLog[]
  loading: boolean
  error: string | null
  actionOptions: Array<{ label: string; value: ActivityLogAction }>
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
}>()

const activityActionLabels: Record<ActivityLogAction, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  STATUS_UPDATE: 'Changement de statut',
  LOGIN: 'Connexion',
  LOGIN_FAILED: 'Connexion échouée',
  LOGOUT: 'Déconnexion',
  PASSWORD_CHANGE: 'Changement de mot de passe',
  RESET_PASSWORD: 'Réinitialisation de mot de passe',
}

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const formatActivityAction = (action: ActivityLogAction) => activityActionLabels[action] ?? action

const getActivityActionSeverity = (action: ActivityLogAction) => {
  if (action === 'CREATE' || action === 'LOGIN') return 'success'
  if (action === 'UPDATE' || action === 'STATUS_UPDATE' || action === 'PASSWORD_CHANGE') return 'info'
  if (action === 'LOGIN_FAILED' || action === 'DELETE') return 'danger'

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
            <InputText
              v-model="globalSearch"
              placeholder="Rechercher"
              aria-label="Rechercher dans le journal d'activités"
            />
          </span>

          <Select
            v-model="selectedAction"
            :options="actionOptions"
            option-label="label"
            option-value="value"
            placeholder="Action"
            show-clear
            class="filter-select"
          />
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
      v-model:filters="filters"
      :value="logs"
      :loading="loading"
      :global-filter-fields="[
        'actor_email',
        'action',
        'description',
        'target_user_email',
        'object_type',
        'object_id',
        'ip_address',
      ]"
      paginator
      :rows="10"
      :rows-per-page-options="[10, 20, 50]"
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
          <span>Aucune activité trouvée</span>
        </div>
      </template>

      <Column field="created_at" header="Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column field="actor_email" header="Utilisateur" sortable>
        <template #body="{ data }">
          {{ data.actor_email || 'Anonyme' }}
        </template>
      </Column>

      <Column field="action" header="Action" sortable>
        <template #body="{ data }">
          <Tag
            :value="formatActivityAction(data.action)"
            :severity="getActivityActionSeverity(data.action)"
          />
        </template>
      </Column>

      <Column field="description" header="Description" sortable />

      <Column field="target_user_email" header="Cible" sortable>
        <template #body="{ data }">
          {{ data.target_user_email || '-' }}
        </template>
      </Column>

      <Column field="ip_address" header="Adresse IP" sortable>
        <template #body="{ data }">
          {{ data.ip_address || '-' }}
        </template>
      </Column>
    </DataTable>
  </section>
</template>
