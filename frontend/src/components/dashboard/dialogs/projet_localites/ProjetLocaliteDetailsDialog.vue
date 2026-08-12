<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { ProjetLocalite } from '@/types/projetLocalite'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  projetLocalite: ProjetLocalite | null
}>()

const close = () => {
  visible.value = false
}

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const getStatutExecutionSeverity = (statut: ProjetLocalite['statut_execution']) => {
  if (statut === 'Achevé') return 'success'
  if (statut === 'En cours') return 'warn'
  if (statut === 'Suspendu') return 'danger'
  if (statut === 'Non démarré') return 'info'

  return 'secondary'
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail de la localité du projet" modal class="entity-dialog" dismissable-mask>
    <div v-if="projetLocalite" class="entity-details">
      <div class="details-wide"><span class="detail-label">Projet</span><strong>{{ projetLocalite.projet_libelle }}</strong></div>
      <div><span class="detail-label">Localité</span><strong>{{ projetLocalite.nom }}</strong></div>
      <div><span class="detail-label">Type</span><strong>{{ projetLocalite.type }}</strong></div>
      <div><span class="detail-label">Sous-préfecture</span><strong>{{ projetLocalite.sous_prefecture_nom }}</strong></div>
      <div><span class="detail-label">Département</span><strong>{{ projetLocalite.departement_nom }}</strong></div>
      <div><span class="detail-label">Taux</span><strong>{{ projetLocalite.taux_realisation }}%</strong></div>
      <div>
        <span class="detail-label"> Statut d'exécution</span>
        <Tag :value="projetLocalite.statut_execution" :severity="getStatutExecutionSeverity(projetLocalite.statut_execution)" />
      </div>
      <div><span class="detail-label">Suspendu</span><Tag :value="projetLocalite.est_suspendu ? 'Oui' : 'Non'" :severity="projetLocalite.est_suspendu ? 'danger' : 'success'" /></div>
      <div><span class="detail-label">Localité active</span><Tag :value="projetLocalite.is_active ? 'Oui' : 'Non'" :severity="projetLocalite.is_active ? 'success' : 'danger'" /></div>
       <div><span class="detail-label">Date de création</span><strong>{{ formatDate(projetLocalite.created_at) }}</strong></div>
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
