<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import { getBackendFileUrl } from '@/services/api'
import type { NiveauValidation, StatutValidation, Validation } from '@/types/validation'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })
const selectedNiveau = defineModel<NiveauValidation | null>('selectedNiveau', { required: true })
const selectedStatut = defineModel<StatutValidation | null>('selectedStatut', { required: true })

defineProps<{
  validations: Validation[]
  loading: boolean
  error: string | null
  canManage: boolean
  niveauOptions: Array<{ label: string; value: NiveauValidation }>
  statutOptions: Array<{ label: string; value: StatutValidation }>
}>()

const emit = defineEmits<{
  resetFilters: []
  view: [validation: Validation]
  edit: [validation: Validation]
}>()

const niveauLabels: Record<NiveauValidation, string> = {
  1: 'Conseiller',
  2: 'Vice-Président',
  3: 'Président',
  4: 'DAF',
}

const getStatutSeverity = (statut: StatutValidation) => {
  if (statut === 'APPROUVE') return 'success'
  if (statut === 'EN_ATTENTE') return 'warn'

  return 'danger'
}

const formatStatut = (statut: StatutValidation) => {
  if (statut === 'APPROUVE') return 'Approuvé'
  if (statut === 'EN_ATTENTE') return 'En attente'

  return 'Rejeté'
}

const formatNiveau = (niveau: NiveauValidation) => niveauLabels[niveau]

const formatNote = (note: Validation['note_sur_20']) => note ?? '-'

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const canTreatValidation = (validation: Validation) =>
  validation.statut === 'EN_ATTENTE' && validation.can_traiter
</script>

<template>
  <section class="surface-card table-shell">
    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText v-model="globalSearch" placeholder="Rechercher" aria-label="Rechercher" />
          </span>

          <Select
            v-model="selectedNiveau"
            :options="niveauOptions"
            option-label="label"
            option-value="value"
            placeholder="Niveau"
            show-clear
            class="filter-select"
          />

          <Select
            v-model="selectedStatut"
            :options="statutOptions"
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
      :value="validations"
      :loading="loading"
      :global-filter-fields="[
        'projet_libelle',
        'validateur_email',
        'niveau',
        'statut',
        'commentaire',
      ]"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      filter-display="menu"
      striped-rows
      removable-sort
      table-style="min-width: 56rem"
    >
      <template #header>
        <p v-if="error" class="table-error" role="alert">
          {{ error }}
        </p>
      </template>

      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox" />
          <span>Aucune validation trouvée</span>
        </div>
      </template>

      <Column field="projet_libelle" header="Projet" sortable />
      <Column field="validateur_email" header="Validateur" sortable />

      <Column field="niveau" header="Niveau" sortable>
        <template #body="{ data }">
          <Tag :value="formatNiveau(data.niveau)" severity="info" />
        </template>
      </Column>

      <Column field="statut" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value="formatStatut(data.statut)" :severity="getStatutSeverity(data.statut)" />
        </template>
      </Column>

      <Column field="note_sur_20" header="Note / 20" sortable>
        <template #body="{ data }">
          {{ formatNote(data.note_sur_20) }}
        </template>
      </Column>

      <Column field="commentaire" header="Commentaire" sortable>
        <template #body="{ data }">
          {{ data.commentaire || '-' }}
        </template>
      </Column>

      <Column field="pj_url" header="Pièce jointe" sortable>
        <template #body="{ data }">
          <a v-if="data.pj_url" :href="getBackendFileUrl(data.pj_url)" target="_blank" rel="noreferrer">
            Document
          </a>
          <span v-else>-</span>
        </template>
      </Column>

      <Column field="date_validation" header="Crée le" sortable>
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
              aria-label="Voir"
              @click="emit('view', data)"
            />
            <Button
              v-if="canTreatValidation(data) && canManage"
              icon="pi pi-check-circle"
              label="Traiter"
              severity="success"
              outlined
              size="small"
              aria-label="Traiter"
              @click="emit('edit', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
