<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { Departement } from '@/types/territoires/departement'
import type { Localite } from '@/types/territoires/localite'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'
import type { Profil, User } from '@/types/user'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  user: User | null
  sousPrefectures?: SousPrefecture[]
  departements?: Departement[]
  localites?: Localite[]
}>()

const profilLabels: Record<Profil, string> = {
  CONSEILLER: 'Conseiller',
  VP: 'Vice-Président',
  PRESIDENT: 'Président',
  DG: 'Directeur Général',
  DGA: 'Directeur Général Adjoint',
  DT: 'Directeur Technique',
  DAF: 'DAF',
  SOUS_PREFET: 'Sous-préfet',
  ADMIN: 'Administrateur',
}

const formatProfil = (profil: Profil) => profilLabels[profil]

const getSousPrefectureNom = (id: string | null | undefined) => {
  if (!id) return '-'

  return props.sousPrefectures?.find((sousPrefecture) => sousPrefecture.id === id)?.nom ?? id
}

const getDepartementNom = (id: string | null | undefined) => {
  if (!id) return '-'

  return props.departements?.find((departement) => departement.id === id)?.nom ?? id
}

const getLocaliteNoms = (ids: string[] | null | undefined) => {
  if (!ids?.length) return '-'

  return ids
    .map((id) => props.localites?.find((localite) => localite.id === id)?.nom ?? id)
    .join(', ')
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
  <Dialog v-model:visible="visible" header="Détail de l'utilisateur" modal class="user-dialog">
    <div v-if="user" class="user-details">
      <div>
        <span class="detail-label">Nom</span>
        <strong>{{ user.nom }}</strong>
      </div>
      <div>
        <span class="detail-label">Prénom</span>
        <strong>{{ user.prenom }}</strong>
      </div>
      <div>
        <span class="detail-label">Email</span>
        <strong>{{ user.email }}</strong>
      </div>
      <div>
        <span class="detail-label">Téléphone</span>
        <strong>{{ user.telephone || '-' }}</strong>
      </div>
      <div>
        <span class="detail-label">Profil</span>
        <Tag :value="formatProfil(user.profil)" severity="info" />
      </div>
      <div>
        <span class="detail-label">Statut</span>
        <Tag :value="user.is_active ? 'Actif' : 'Inactif'" :severity="user.is_active ? 'success' : 'danger'" />
      </div>
       <div>
        <span class="detail-label">Photo</span>
        <strong>{{ user.photo_profile || '-' }}</strong>
      </div>
      <div>
        <span class="detail-label">Sous-préfecture</span>
        <strong>{{ getSousPrefectureNom(user.sous_prefecture_id) }}</strong>
      </div>
      <div>
        <span class="detail-label">Département</span>
        <strong>{{ getDepartementNom(user.departement_id) }}</strong>
      </div>
      <div class="details-wide">
        <span class="detail-label">Localités</span>
        <strong>{{ getLocaliteNoms(user.localite_ids) }}</strong>
      </div>
      <div>
        <span class="detail-label">Date création</span>
        <strong>{{ formatDate(user.created_at) }}</strong>
      </div>
      <div>
        <span class="detail-label">Date modification</span>
        <strong>{{ formatDate(user.updated_at) }}</strong>
      </div>
    </div>

    <template #footer>
      <Button label="Fermer" severity="secondary" outlined @click="close" />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.user-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.user-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.user-details div {
  display: grid;
  gap: 0.4rem;
}

.detail-label {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 800;
}

.details-wide {
  grid-column: 1 / -1;
}

.user-details strong {
  color: #0f172a;
  font-weight: 700;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .user-details {
    grid-template-columns: 1fr;
  }
}
</style>
