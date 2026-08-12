<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { AlerteTerrain } from '@/types/alerteTerrain'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  alerte: AlerteTerrain | null
}>()

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const urgenceLabels: Record<string, string> = {
  INFO: 'Info',
  MOYEN: 'Moyen',
  URGENT: 'Urgent',
}
const getUrgenceSeverity = (urgence: AlerteTerrain['niveau_urgence']) => {
  if (urgence === 'URGENT') return 'danger'
  if (urgence === 'MOYEN') return 'warn'

  return 'info'
}

const traitementLabels: Record<string, string> = {
  NON_TRAITE: 'Non traité',
  EN_COURS: 'En cours',
  TRAITE: 'Traité',
}
const getTraitementSeverity = (traitement: AlerteTerrain['statut_traitement']) => {
  if (traitement === 'TRAITE') return 'success'
  if (traitement === 'EN_COURS') return 'warn'

  return 'danger'
}

const formatUrgence = (urgence: AlerteTerrain['niveau_urgence']) =>
  urgenceLabels[urgence] ?? urgence

const formatTraitement = (traitement: AlerteTerrain['statut_traitement']) =>
  traitementLabels[traitement] ?? traitement

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail de l'alerte terrain" modal class="entity-dialog" dismissable-mask>
    <div v-if="alerte" class="entity-details">
      <div class="details-wide"><span class="detail-label">Projet</span><strong>{{ alerte.projet_libelle }}</strong></div>
      <div><span class="detail-label">Localité</span><strong>{{ alerte.localite_nom }}</strong></div>
      <div><span class="detail-label">Émetteur</span><strong>{{ alerte.emetteur_email }}</strong></div>
      <div><span class="detail-label">Urgence</span><Tag :value="formatUrgence(alerte.niveau_urgence)" :severity="getUrgenceSeverity(alerte.niveau_urgence)" /></div>
      <div><span class="detail-label">Traitement</span><Tag :value="formatTraitement(alerte.statut_traitement)" :severity="getTraitementSeverity(alerte.statut_traitement)" /></div>
      <div><span class="detail-label">Émise le</span><strong>{{ formatDate(alerte.date_emission) }}</strong></div>
      <div><span class="detail-label">Traité par</span><strong>{{ alerte.traite_par_email || '-' }}</strong></div>
      <div><span class="detail-label">Date traitement</span><strong>{{ formatDate(alerte.date_traitement) }}</strong></div>
      <div class="details-wide"><span class="detail-label">Message</span><strong>{{ alerte.message }}</strong></div>
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
