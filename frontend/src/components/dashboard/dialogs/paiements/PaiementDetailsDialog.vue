<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import { getBackendFileUrl } from '@/services/api'
import type { Paiement, TypeReglement } from '@/types/paiement'
import type { Validation } from '@/types/validation'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  paiement: Paiement | null
  validations?: Validation[]
}>()

const typeReglementLabels: Record<TypeReglement, string> = {
  PARTIEL: 'Partiel',
  TOTAL: 'Total',
}

const formatTypeReglement = (typeReglement: TypeReglement) => typeReglementLabels[typeReglement]

const getTypeReglementSeverity = (typeReglement: TypeReglement) => {
  if (typeReglement === 'TOTAL') return 'success'

  return 'info'
}

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const formatMontant = (montant: Paiement['montant']) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(Number(montant))

const getDafEmail = (validationId: string) =>
  props.validations?.find((validation) => validation.id === validationId)?.validateur_email ?? validationId

const justificatifUrl = computed(() => getBackendFileUrl(props.paiement?.justificatif))

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du paiement" modal class="paiement-dialog" dismissable-mask>
    <div v-if="paiement" class="paiement-details">
      <div>
        <span class="detail-label">Projet</span>
        <strong>{{ paiement.projet_libelle }}</strong>
      </div>
      <div>
        <span class="detail-label">Prestataire</span>
        <strong>{{ paiement.prestataire_nom }}</strong>
      </div>
      <div>
        <span class="detail-label">Montant</span>
        <strong>{{ formatMontant(paiement.montant) }}</strong>
      </div>
      <div>
        <span class="detail-label">Type de règlement</span>
        <Tag
          :value="formatTypeReglement(paiement.type_reglement)"
          :severity="getTypeReglementSeverity(paiement.type_reglement)"
        />
      </div>
      <div>
        <span class="detail-label">Date de paiement</span>
        <strong>{{ formatDate(paiement.date_paiement) }}</strong>
      </div>
      <div>
        <span class="detail-label">Référence mandatement</span>
        <strong>{{ paiement.reference_mandatement || '-' }}</strong>
      </div>
      <div class="details-wide">
        <span class="detail-label">DAF</span>
        <strong>{{ getDafEmail(paiement.validation_daf_id) }}</strong>
      </div>
      <div class="details-wide">
        <span class="detail-label">Justificatif</span>
        <a v-if="justificatifUrl" :href="justificatifUrl" target="_blank" rel="noreferrer">
          Voir le document
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
:deep(.paiement-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.paiement-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.paiement-details div {
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

.paiement-details strong,
.paiement-details a {
  color: #0f172a;
  font-weight: 700;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .paiement-details {
    grid-template-columns: 1fr;
  }
}
</style>
