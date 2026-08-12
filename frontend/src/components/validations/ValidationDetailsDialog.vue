<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { NiveauValidation, StatutValidation, Validation } from '@/types/validation'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  validation: Validation | null
}>()

const niveauLabels: Record<NiveauValidation, string> = {
  1: 'Conseiller',
  2: 'Vice-Président',
  3: 'Président',
  4: 'DAF',
}

const formatNiveau = (niveau: NiveauValidation) => niveauLabels[niveau]

const formatStatut = (statut: StatutValidation) => {
  if (statut === 'APPROUVE') return 'Approuvé'
  if (statut === 'EN_ATTENTE') return 'En attente'

  return 'Rejeté'
}

const getStatutSeverity = (statut: StatutValidation) => {
  if (statut === 'APPROUVE') return 'success'
  if (statut === 'EN_ATTENTE') return 'warn'

  return 'danger'
}

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail de la validation" modal class="validation-dialog">
    <div v-if="validation" class="validation-details">
      <div>
        <span class="detail-label">Projet</span>
        <strong>{{ validation.projet_libelle }}</strong>
      </div>
      <div>
        <span class="detail-label">Validateur</span>
        <strong>{{ validation.validateur_email }}</strong>
      </div>
      <div>
        <span class="detail-label">Niveau</span>
        <strong>{{ formatNiveau(validation.niveau) }}</strong>
      </div>
      <div>
        <span class="detail-label">Statut</span>
        <Tag :value="formatStatut(validation.statut)" :severity="getStatutSeverity(validation.statut)" />
      </div>
      <div>
        <span class="detail-label">Note / 20</span>
        <strong>{{ validation.note_sur_20 ?? '-' }}</strong>
      </div>
      <div>
        <span class="detail-label">Date validation</span>
        <strong>{{ formatDate(validation.date_validation) }}</strong>
      </div>
      <div>
        <span class="detail-label">Paiement autorisé</span>
        <strong>{{ validation.paiement_autorise ? 'Oui' : 'Non' }}</strong>
      </div>
      <div class="details-wide">
        <span class="detail-label">Commentaire</span>
        <strong>{{ validation.commentaire || '-' }}</strong>
      </div>
      <div class="details-wide">
        <span class="detail-label">Pièce jointe</span>
        <a v-if="validation.pj_url" :href="validation.pj_url" target="_blank" rel="noreferrer">
          {{ validation.pj_url || '-' }}
        </a>
        <strong v-else>-</strong>
      </div>
    </div>

    <template #footer>
      <Button label="Fermer" severity="secondary" outlined @click="close" />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.validation-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.validation-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.validation-details div {
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

.validation-details strong,
.validation-details a {
  color: #0f172a;
  font-weight: 700;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .validation-details {
    grid-template-columns: 1fr;
  }
}
</style>
