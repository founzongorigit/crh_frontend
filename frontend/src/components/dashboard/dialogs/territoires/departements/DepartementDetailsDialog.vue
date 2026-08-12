<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { Departement } from '@/types/territoires/departement'
import type { Localite } from '@/types/territoires/localite'
import type { Region } from '@/types/territoires/region'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  departement: Departement | null
  regions?: Region[]
  localites?: Localite[]
}>()

const getRegionNom = (id: string) => props.regions?.find((region) => region.id === id)?.nom ?? id

const getLocaliteNom = (id: string | null) => {
  if (!id) return '-'
  return props.localites?.find((localite) => localite.id === id)?.nom ?? id
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du département" modal class="territory-dialog" dismissable-mask>
    <div v-if="departement" class="territory-details">
      <div>
        <span class="detail-label">Nom</span>
        <strong>{{ departement.nom }}</strong>
      </div>
      <div>
        <span class="detail-label">Statut</span>
        <Tag :value="departement.is_active ? 'Actif' : 'Inactif'" :severity="departement.is_active ? 'success' : 'danger'" />
      </div>
      <div>
        <span class="detail-label">Région</span>
        <strong>{{ getRegionNom(departement.region_id) }}</strong>
      </div>
      <div>
        <span class="detail-label">Chef-lieu</span>
        <strong>{{ getLocaliteNom(departement.chef_lieu_id) }}</strong>
      </div>
      <div>
        <span class="detail-label">Date création</span>
        <strong>{{ formatDate(departement.created_at) }}</strong>
      </div>
      <div>
        <span class="detail-label">Date modification</span>
        <strong>{{ formatDate(departement.updated_at) }}</strong>
      </div>
    </div>

    <template #footer>
      <Button label="Fermer" severity="secondary" outlined @click="close" />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.territory-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.territory-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.territory-details div {
  display: grid;
  gap: 0.4rem;
}

.detail-label {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 800;
}

.territory-details strong {
  color: #0f172a;
  font-weight: 700;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .territory-details {
    grid-template-columns: 1fr;
  }
}
</style>
