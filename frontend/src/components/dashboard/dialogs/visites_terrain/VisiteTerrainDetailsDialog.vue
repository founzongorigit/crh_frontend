<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { getBackendFileUrl } from '@/services/api'
import type { VisiteTerrain } from '@/types/visiteTerrain'
import Tag from 'primevue/tag'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  visite: VisiteTerrain | null
}>()

const visiteTerrainStatutLabels: Record<string, string> = {
  NON_DEMARRE: 'Non démarré',
  EN_COURS: 'En cours',
  SUSPENDU: 'Suspendu',
  ACHEVE: 'Achevé',
}
const getTraitementSeverity = (traitement: VisiteTerrain['statut_constate']) => {
  if (traitement === 'EN_COURS') return 'warn'
  if (traitement === 'SUSPENDU') return 'danger'
  if (traitement === 'ACHEVE') return 'success'

  return 'info'
}
const formatStatut = (statut: VisiteTerrain['statut_constate']) => {
  if (!statut) return '-'

  return visiteTerrainStatutLabels[statut] ?? statut
}

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))
const rapportUrl = computed(() => getBackendFileUrl(props.visite?.rapport_url))

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail de la visite terrain" modal class="entity-dialog" dismissable-mask>
    <div v-if="visite" class="entity-details">
      <div class="details-wide"><span class="detail-label">Projet</span><strong>{{ visite.projet_libelle }}</strong></div>
      <div><span class="detail-label">Localité</span><strong>{{ visite.localite_nom || '-' }}</strong></div>
      <div><span class="detail-label">Visiteur</span><strong>{{ visite.visiteur_email }}</strong></div>
      <div><span class="detail-label">Date visite</span><strong>{{ formatDate(visite.date_visite) }}</strong></div>
      <div><span class="detail-label">Taux constaté</span><strong>{{ visite.taux_constate }}%</strong></div>
      <div><span class="detail-label">Statut constaté</span><Tag :value="formatStatut(visite.statut_constate)" :severity="getTraitementSeverity(visite.statut_constate)" /></div>
      <div class="details-wide"><span class="detail-label">Observations</span><strong>{{ visite.observations || '-' }}</strong></div>
      <div><span class="detail-label">Date Création</span><strong>{{ formatDate(visite.created_at) }}</strong></div>
      <div><span class="detail-label">Date Modification</span><strong>{{ formatDate(visite.updated_at) }}</strong></div>
      <div class="details-wide">
        <span class="detail-label">Rapport</span>
        <a v-if="rapportUrl" :href="rapportUrl" target="_blank" rel="noreferrer">Voir le document</a>
        <strong v-else>-</strong>
      </div>
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
.entity-details strong, .entity-details a { color: #0f172a; font-weight: 700; overflow-wrap: anywhere; }
@media (max-width: 760px) { .entity-details { grid-template-columns: 1fr; } }
</style>
