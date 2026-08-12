<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import { getBackendFileUrl } from '@/services/api'
import type { CahierCharges } from '@/types/cahierCharges'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  cahier: CahierCharges | null
}>()

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const fichierPdfUrl = computed(() => getBackendFileUrl(props.cahier?.fichier_pdf))

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du cahier des charges" modal class="entity-dialog" dismissable-mask>
    <div v-if="cahier" class="entity-details">
      <div class="details-wide"><span class="detail-label">Type d'intervention</span><strong>{{ cahier.type_intervention_nom }}</strong></div>
      <div><span class="detail-label">Version</span><strong>{{ cahier.version }}</strong></div>
      <div><span class="detail-label">Date upload</span><strong>{{ formatDate(cahier.date_upload) }}</strong></div>
      <div><span class="detail-label">Statut</span><Tag :value="cahier.actif ? 'Actif' : 'Inactif'" :severity="cahier.actif ? 'success' : 'danger'" /></div>
      <div class="details-wide">
        <span class="detail-label">Fichier PDF</span>
        <a v-if="fichierPdfUrl" :href="fichierPdfUrl" target="_blank" rel="noreferrer">Voir le document</a>
        <strong v-else>-</strong>
      </div>
      <div><span class="detail-label">Créé le</span><strong>{{ formatDate(cahier.created_at) }}</strong></div>
      <div><span class="detail-label">Modifié le</span><strong>{{ formatDate(cahier.updated_at) }}</strong></div>
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
.entity-details strong, .entity-details a { color: #0f172a; font-weight: 700; overflow-wrap: anywhere; }
@media (max-width: 760px) { .entity-details { grid-template-columns: 1fr; } }
</style>
