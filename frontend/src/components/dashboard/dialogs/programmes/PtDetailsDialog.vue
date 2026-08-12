<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import type { ProgrammeTriennal } from '@/types/pt'
import Tag from 'primevue/tag'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  programme: ProgrammeTriennal | null
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))
const formatMontant = (montant: ProgrammeTriennal['budget_total']) => new Intl.NumberFormat('fr-FR').format(Number(montant))

const statutLabels: Record<string, string> = {
  EN_PREPARATION: 'En préparation',
  ACTIF: 'Actif',
  CLOS: 'Clos',
}
const getTraitementSeverity = (progamme: ProgrammeTriennal['statut']) => {
  if (progamme === 'EN_PREPARATION') return 'warn'
  if (progamme === 'ACTIF') return 'success'

  return 'info'
}

const formatStatut = (statut: ProgrammeTriennal['statut']) => statutLabels[statut] ?? statut

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du programme" modal class="entity-dialog" dismissable-mask>
    <div v-if="programme" class="entity-details">
      <div class="details-wide"><span class="detail-label">Libellé</span><strong>{{ programme.libelle }}</strong></div>
      <div><span class="detail-label">Année début</span><strong>{{ programme.annee_debut }}</strong></div>
      <div><span class="detail-label">Année fin</span><strong>{{ programme.annee_fin }}</strong></div>
      <div><span class="detail-label">Budget total</span><strong>{{ formatMontant(programme.budget_total) }}</strong></div>
      <div><span class="detail-label">Statut</span><Tag :value="formatStatut(programme.statut)" :severity="getTraitementSeverity(programme.statut)" /></div>
      <div><span class="detail-label">Créé le</span><strong>{{ formatDate(programme.created_at) }}</strong></div>
      <div><span class="detail-label">Modifié le</span><strong>{{ formatDate(programme.updated_at) }}</strong></div>
    </div>
    <template #footer><Button label="Fermer" severity="secondary" outlined @click="close" /></template>
  </Dialog>
</template>

<style scoped>
:deep(.entity-dialog) { width: min(42rem, calc(100vw - 2rem)); }
.entity-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.entity-details div { display: grid; gap: 0.4rem; }
.detail-label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.details-wide { grid-column: 1 / -1; }
.entity-details strong { color: #0f172a; font-weight: 700; overflow-wrap: anywhere; }
@media (max-width: 760px) { .entity-details { grid-template-columns: 1fr; } }
</style>
