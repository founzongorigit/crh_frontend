<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { getBackendFileUrl } from '@/services/api'
import type { Prestataire } from '@/types/prestataire'
import type { Projet } from '@/types/projet'
import type { Validation } from '@/types/validation'
import type {
  Paiement,
  PaiementCreatePayload,
  PaiementUpdatePayload,
  TypeReglement,
} from '@/types/paiement'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  paiement: Paiement | null
  projets?: Projet[]
  prestataires?: Prestataire[]
  validations?: Validation[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: PaiementCreatePayload | PaiementUpdatePayload]
}>()

const typeReglementOptions = [
  { label: 'Partiel', value: 'PARTIEL' },
  { label: 'Total', value: 'TOTAL' },
]

const form = reactive({
  projet_id: '',
  prestataire_id: '',
  montant: null as number | null,
  type_reglement: 'PARTIEL' as TypeReglement,
  date_paiement: '',
  validation_daf_id: '',
  reference_mandatement: '',
  justificatif: null as File | null,
  existing_justificatif: '',
})

const isEditMode = computed(() => !!props.paiement)
const title = computed(() => (isEditMode.value ? 'Modifier le paiement' : 'Nouveau paiement'))
const existingJustificatifUrl = computed(() => getBackendFileUrl(form.existing_justificatif))
const validationDafOptions = computed(() =>
  (props.validations ?? [])
    .filter((validation) => validation.niveau === 4 && validation.statut === 'APPROUVE')
    .map((validation) => ({
      label: `${validation.projet_libelle} - ${validation.validateur_email}`,
      value: validation.id,
      projetId: validation.projet_id,
    })),
)
const filteredValidationDafOptions = computed(() =>
  form.projet_id
    ? validationDafOptions.value.filter((validation) => validation.projetId === form.projet_id)
    : validationDafOptions.value,
)
const submitError = computed(() => {
  if (!form.projet_id) return 'Le projet est obligatoire.'
  if (!form.prestataire_id) return 'Le prestataire est obligatoire.'
  if (form.montant === null) return 'Le montant est obligatoire.'
  if (!form.date_paiement) return 'La date de paiement est obligatoire.'
  if (!form.validation_daf_id) return 'La validation DAF est obligatoire.'

  return ''
})

watch(
  () => [props.paiement, visible.value] as const,
  ([paiement]) => {
    if (!visible.value) return

    form.projet_id = paiement?.projet_id ?? ''
    form.prestataire_id = paiement?.prestataire_id ?? ''
    form.montant = paiement?.montant === undefined ? null : Number(paiement.montant)
    form.type_reglement = paiement?.type_reglement ?? 'PARTIEL'
    form.date_paiement = paiement?.date_paiement ?? ''
    form.validation_daf_id = paiement?.validation_daf_id ?? ''
    form.reference_mandatement = paiement?.reference_mandatement ?? ''
    form.justificatif = null
    form.existing_justificatif = paiement?.justificatif ?? ''
  },
  { immediate: true },
)

watch(
  () => form.projet_id,
  () => {
    if (!form.validation_daf_id) return

    const validationExistsForProject = filteredValidationDafOptions.value.some(
      (validation) => validation.value === form.validation_daf_id,
    )
    if (!validationExistsForProject) form.validation_daf_id = ''
  },
)

const close = () => {
  visible.value = false
}

const selectFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.justificatif = input.files?.[0] ?? null
}

const submit = () => {
  if (submitError.value) return

  const payload = {
    projet_id: form.projet_id,
    prestataire_id: form.prestataire_id,
    montant: form.montant ?? 0,
    type_reglement: form.type_reglement,
    date_paiement: form.date_paiement,
    validation_daf_id: form.validation_daf_id,
    reference_mandatement: form.reference_mandatement || null,
    ...(form.justificatif ? { justificatif: form.justificatif } : {}),
  }

  emit('save', payload)
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="paiement-dialog">
    <form class="paiement-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="paiement_projet_id">Projet</label>
        <Select
          id="paiement_projet_id"
          v-model="form.projet_id"
          :options="projets"
          option-label="libelle_officiel"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner un projet"
          filter
          required
        />
      </div>

      <div class="form-field">
        <label for="prestataire_id">Prestataire</label>
        <Select
          id="prestataire_id"
          v-model="form.prestataire_id"
          :options="prestataires"
          option-label="raison_sociale"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner un prestataire"
          filter
          required
        />
      </div>

      <div class="form-field">
        <label for="montant">Montant</label>
        <InputNumber id="montant" v-model="form.montant" :min="1" required />
      </div>

      <div class="form-field">
        <label for="type_reglement">Type de règlement</label>
        <Select
          id="type_reglement"
          v-model="form.type_reglement"
          :options="typeReglementOptions"
          option-label="label"
          option-value="value"
          required
        />
      </div>

      <div class="form-field">
        <label for="date_paiement">Date de paiement</label>
        <InputText id="date_paiement" v-model="form.date_paiement" type="date" required />
      </div>

      <div class="form-field">
        <label for="validation_daf_id">Validation DAF</label>
        <Select
          id="validation_daf_id"
          v-model="form.validation_daf_id"
          :options="filteredValidationDafOptions"
          option-label="label"
          option-value="value"
          class="form-control"
          placeholder="Sélectionner une validation DAF"
          filter
          required
        />
      </div>

      <div class="form-field">
        <label for="reference_mandatement">Référence mandatement</label>
        <InputText id="reference_mandatement" v-model="form.reference_mandatement" />
      </div>

      <div class="form-field form-field-wide">
        <label for="justificatif">Justificatif</label>
        <input id="justificatif" type="file" class="file-input" @change="selectFile" />
        <span v-if="form.justificatif" class="file-hint">{{ form.justificatif.name }}</span>
        <a
          v-else-if="existingJustificatifUrl"
          class="file-hint"
          :href="existingJustificatifUrl"
          target="_blank"
          rel="noreferrer"
        >
          Document actuel
        </a>
      </div>

      <p v-if="submitError" class="form-error form-field-wide" role="alert">
        {{ submitError }}
      </p>

      <footer class="dialog-actions">
        <Button type="button" label="Annuler" severity="secondary" outlined @click="close" />
        <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="loading" :disabled="Boolean(submitError)" />
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
:deep(.paiement-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.paiement-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-field {
  display: grid;
  gap: 0.4rem;
}

.form-field label {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 800;
}

.form-control {
  width: 100%;
}

.file-input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  background: #ffffff;
}

.file-hint {
  color: #475569;
  font-size: 0.85rem;
  font-weight: 700;
}

.form-error {
  color: #b91c1c;
  font-size: 0.86rem;
  font-weight: 700;
  margin: 0;
}

.form-field-wide,
.dialog-actions {
  grid-column: 1 / -1;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 760px) {
  .paiement-form {
    grid-template-columns: 1fr;
  }
}
</style>
