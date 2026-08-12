<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import type { Projet } from '@/types/projet'
import Tag from 'primevue/tag'

const filters = defineModel<DataTableFilterMeta>('filters', { required: true })
const globalSearch = defineModel<string>('globalSearch', { required: true })

defineProps<{
  projets: Projet[]
  loading: boolean
  error: string | null
  canManage: boolean
}>()

const emit = defineEmits<{
  refresh: []
  resetFilters: []
  view: [projet: Projet]
  edit: [projet: Projet]
  delete: [projet: Projet]
}>()

const formatMontant = (montant: Projet['cout_total']) =>
  new Intl.NumberFormat('fr-FR').format(Number(montant))

const sourceFinancementLabels: Record<string, string> = {
  FI: "Fonds d'investissement",
  SEE: 'Subvention État',
  MIXTE: 'Mixte',
}

const statutLabels: Record<string, string> = {
  PLANIFIE: 'Planifié',
  EN_COURS: 'En cours',
  EN_VALIDATION: 'En validation',
  VALIDE: 'Validé',
  PAYE_PARTIELLEMENT: 'Payé partiellement',
  ACHEVE: 'Achevé',
  SUSPENDU: 'Suspendu',
}

const getProjetStatutSeverity = (statut: Projet['statut']) => {
  if (statut === 'PLANIFIE') return 'secondary'
  if (statut === 'EN_COURS') return 'warn'
  if (statut === 'EN_VALIDATION') return 'warn'
  if (statut === 'VALIDE') return 'success'
  if (statut === 'PAYE_PARTIELLEMENT') return 'info'
  if (statut === 'ACHEVE') return 'success'
  if (statut === 'SUSPENDU') return 'danger'

  return 'secondary'
}

const formatSourceFinancement = (source: Projet['source_financement']) =>
  sourceFinancementLabels[source] ?? source

const formatStatut = (statut: Projet['statut']) => statutLabels[statut] ?? statut
</script>

<template>
  <section class="surface-card table-shell">
    <Toolbar class="dashboard-toolbar">
      <template #start>
        <div class="filter-row">
          <span class="search-field">
            <i class="pi pi-search" />
            <InputText v-model="globalSearch" placeholder="Rechercher" aria-label="Rechercher un projet" />
          </span>
        </div>
      </template>
      <template #end>
        <div class="toolbar-actions">
          <Button icon="pi pi-refresh" label="Rafraîchir" severity="secondary" outlined :loading="loading" @click="emit('refresh')" />
          <Button icon="pi pi-filter-slash" label="Réinitialiser" severity="secondary" outlined @click="emit('resetFilters')" />
        </div>
      </template>
    </Toolbar>

    <DataTable
      v-model:filters="filters"
      :value="projets"
      :loading="loading"
      :global-filter-fields="['libelle_officiel', 'programme_libelle', 'domaine_nom', 'type_intervention_nom', 'statut']"
      paginator
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      data-key="id"
      striped-rows
      removable-sort
      table-style="min-width: 86rem"
    >
      <template #header><p v-if="error" class="table-error" role="alert">{{ error }}</p></template>
      <template #empty><div class="empty-state"><i class="pi pi-inbox" /><span>Aucun projet trouvé</span></div></template>

      <Column field="libelle_officiel" header="Projet" sortable />
      <Column field="programme_libelle" header="Programme" sortable />
      <Column field="domaine_nom" header="Domaine" sortable />
      <Column field="type_intervention_nom" header="Type intervention" sortable />
      <Column field="cout_total" header="Coût total" sortable>
        <template #body="{ data }">{{ formatMontant(data.cout_total) }}</template>
      </Column>
      <Column field="source_financement" header="Source" sortable>
        <template #body="{ data }">{{ formatSourceFinancement(data.source_financement) }}</template>
      </Column>
      <Column field="statut" header="Statut" sortable>
        <template #body="{ data }">
          <Tag :value="formatStatut(data.statut)" 
               :severity="getProjetStatutSeverity(data.statut)" />
        </template>
      </Column>
      <Column field="taux_realisation" header="Taux" sortable>
        <template #body="{ data }">{{ data.taux_realisation }}%</template>
      </Column>
      <Column header="Actions" class="actions-column">
        <template #body="{ data }">
          <div class="row-actions">
            <Button icon="pi pi-eye" severity="info" text rounded aria-label="Voir" @click="emit('view', data)" />
            <Button v-if="canManage" icon="pi pi-pencil" severity="secondary" text rounded aria-label="Modifier" @click="emit('edit', data)" />
            <Button v-if="canManage" icon="pi pi-trash" severity="danger" text rounded aria-label="Supprimer" @click="emit('delete', data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>
