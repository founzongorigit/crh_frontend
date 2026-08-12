<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import type { TypeIntervention } from '@/types/typeIntervention'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  typeIntervention: TypeIntervention | null
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du type d'intervention" modal class="entity-dialog" dismissable-mask>
    <div v-if="typeIntervention" class="entity-details">
      <div><span class="detail-label">Nom</span><strong>{{ typeIntervention.nom }}</strong></div>
      <div><span class="detail-label">Domaine</span><strong>{{ typeIntervention.domaine_nom }}</strong></div>
      <div><span class="detail-label">Code comptable</span><strong>{{ typeIntervention.code_comptable || '-' }}</strong></div>
      <div class="details-wide"><span class="detail-label">Description</span><strong>{{ typeIntervention.description || '-' }}</strong></div>
      <div><span class="detail-label">Créé le</span><strong>{{ formatDate(typeIntervention.created_at) }}</strong></div>
      <div><span class="detail-label">Modifié le</span><strong>{{ formatDate(typeIntervention.updated_at) }}</strong></div>
    </div>

    <template #footer>
      <Button label="Fermer" severity="secondary" outlined @click="close" />
    </template>
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
