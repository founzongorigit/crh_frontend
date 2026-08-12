<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import type { Prestataire } from '@/types/prestataire'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  prestataire: Prestataire | null
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR').format(new Date(date))

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du prestataire" modal class="entity-dialog" dismissable-mask>
    <div v-if="prestataire" class="entity-details">
      <div class="details-wide"><span class="detail-label">Raison sociale</span><strong>{{ prestataire.raison_sociale }}</strong></div>
      <div><span class="detail-label">NIF</span><strong>{{ prestataire.num_id_fiscal || '-' }}</strong></div>
      <div><span class="detail-label">Siège</span><strong>{{ prestataire.siege || '-' }}</strong></div>
      <div><span class="detail-label">Téléphone</span><strong>{{ prestataire.telephone || '-' }}</strong></div>
      <div><span class="detail-label">Email</span><strong>{{ prestataire.email || '-' }}</strong></div>
      <div><span class="detail-label">Représentant</span><strong>{{ prestataire.representant || '-' }}</strong></div>
      <div><span class="detail-label">Créé le</span><strong>{{ formatDate(prestataire.created_at) }}</strong></div>
      <div><span class="detail-label">Modifié le</span><strong>{{ formatDate(prestataire.updated_at) }}</strong></div>
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
