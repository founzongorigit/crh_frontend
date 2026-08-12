<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { AffectationVPDepartement } from '@/types/affectation'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  affectations: AffectationVPDepartement[]
}>()

const firstAffectation = computed(() => props.affectations[0] ?? null)

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail de l'affectation" modal class="affectation-dialog">
    <div v-if="firstAffectation" class="affectation-details">
      <div>
        <span class="detail-label">Vice-président</span>
        <strong>{{ firstAffectation.vice_president_nom }}</strong>
      </div>
      <div>
        <span class="detail-label">Email</span>
        <strong>{{ firstAffectation.vice_president_email }}</strong>
      </div>

      <div class="details-wide affectation-list">
        <div class="affectation-list-head">
          <span>Département</span>
          <span>Principal</span>
          <span>Début</span>
          <span>Fin</span>
        </div>
        <div
          v-for="affectation in affectations"
          :key="affectation.id"
          class="affectation-list-row"
        >
          <strong>{{ affectation.departement_nom }}</strong>
          <Tag
            :value="affectation.est_principal ? 'Oui' : 'Non'"
            :severity="affectation.est_principal ? 'success' : 'secondary'"
          />
          <span>{{ formatDate(affectation.date_debut) }}</span>
          <span>{{ formatDate(affectation.date_fin ?? null) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Fermer" severity="secondary" outlined @click="close" />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.affectation-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.affectation-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.affectation-details div {
  display: grid;
  gap: 0.4rem;
}

.detail-label {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 800;
}

.affectation-details strong {
  color: #0f172a;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.details-wide {
  grid-column: 1 / -1;
}

.affectation-list {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.affectation-list-head,
.affectation-list-row {
  display: grid;
  grid-template-columns: minmax(10rem, 1fr) 7rem 7rem 7rem;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
}

.affectation-list-head {
  color: #64748b;
  background: #f8fafc;
  font-size: 0.8rem;
  font-weight: 800;
}

.affectation-list-row + .affectation-list-row {
  border-top: 1px solid #e2e8f0;
}

.affectation-list-row span {
  color: #0f172a;
  font-weight: 700;
}

@media (max-width: 760px) {
  .affectation-details {
    grid-template-columns: 1fr;
  }

  .affectation-list-head,
  .affectation-list-row {
    grid-template-columns: 1fr;
  }
}
</style>
