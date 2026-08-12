<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { Departement } from '@/types/territoires/departement'
import type { Localite, TypeLocalite } from '@/types/territoires/localite'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  localite: Localite | null
  sousPrefectures?: SousPrefecture[]
  departements?: Departement[]
}>()

const typeLabels: Record<TypeLocalite, string> = {
  village: 'Village',
  campement: 'Campement',
  ville: 'Ville',
  canton: 'Canton',
  autre: 'Autre',
}

const formatType = (type: TypeLocalite) => typeLabels[type]

const getSousPrefectureNom = (id: string) =>
  props.sousPrefectures?.find((sousPrefecture) => sousPrefecture.id === id)?.nom ?? id

const getDepartementNom = (id: string) =>
  props.departements?.find((departement) => departement.id === id)?.nom ?? id

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail de la localité" modal class="territory-dialog" dismissable-mask>
    <div v-if="localite" class="territory-details">
      <div>
        <span class="detail-label">Nom</span>
        <strong>{{ localite.nom }}</strong>
      </div>
      <div>
        <span class="detail-label">Type</span>
        <Tag :value="formatType(localite.type)" severity="info" />
      </div>
      <div>
        <span class="detail-label">Statut</span>
        <Tag :value="localite.is_active ? 'Actif' : 'Inactif'" :severity="localite.is_active ? 'success' : 'danger'" />
      </div>
      <div>
        <span class="detail-label">Sous-préfecture</span>
        <strong>{{ getSousPrefectureNom(localite.sous_prefecture_id) }}</strong>
      </div>
      <div>
        <span class="detail-label">Département</span>
        <strong>{{ getDepartementNom(localite.departement_id) }}</strong>
      </div>
      <div>
        <span class="detail-label">Latitude</span>
        <strong>{{ localite.latitude ?? '-' }}</strong>
      </div>
      <div>
        <span class="detail-label">Longitude</span>
        <strong>{{ localite.longitude ?? '-' }}</strong>
      </div>
      <div>
        <span class="detail-label">Date création</span>
        <strong>{{ formatDate(localite.created_at) }}</strong>
      </div>
      <div>
        <span class="detail-label">Date modification</span>
        <strong>{{ formatDate(localite.updated_at) }}</strong>
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
