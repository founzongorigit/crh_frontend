<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { getBackendFileUrl } from '@/services/api'
import type {
  NiveauValidation,
  StatutValidation,
  Validation,
  ValidationUpdatePayload,
} from '@/types/validation'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  validation: Validation | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: ValidationUpdatePayload]
}>()

const niveauLabels: Record<NiveauValidation, string> = {
  1: 'Conseiller',
  2: 'Vice-Président',
  3: 'Président',
  4: 'DAF',
}

const statutOptions = [
  { label: 'En attente', value: 'EN_ATTENTE' },
  { label: 'Approuvé', value: 'APPROUVE' },
  { label: 'Rejeté', value: 'REJETE' },
]

const form = reactive({
  statut: 'EN_ATTENTE' as StatutValidation,
  note_sur_20: null as number | null,
  commentaire: '',
  piece_jointe: null as File | null,
  existing_pj_url: '',
})

const title = computed(() => 'Traiter la validation')
const niveauLabel = computed(() =>
  props.validation ? niveauLabels[props.validation.niveau] : '-',
)
const existingPieceJointeUrl = computed(() => getBackendFileUrl(form.existing_pj_url))

watch(
  () => [props.validation, visible.value] as const,
  ([validation]) => {
    if (!visible.value) return

    form.statut = validation?.statut ?? 'EN_ATTENTE'
    form.note_sur_20 = validation?.note_sur_20 === null ? null : Number(validation?.note_sur_20)
    form.commentaire = validation?.commentaire ?? ''
    form.piece_jointe = null
    form.existing_pj_url = validation?.pj_url ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const selectFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.piece_jointe = input.files?.[0] ?? null
}

const submit = () => {
  if (!props.validation) return

  const payload = {
    statut: form.statut,
    note_sur_20: form.note_sur_20,
    commentaire: form.commentaire || null,
    ...(form.piece_jointe ? { piece_jointe: form.piece_jointe } : {}),
  }

  emit('save', payload)
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="validation-dialog">
    <form class="validation-form" @submit.prevent="submit">
      <div class="readonly-field form-field-wide">
        <span class="readonly-label">Projet</span>
        <strong>{{ validation?.projet_libelle || '-' }}</strong>
      </div>

      <div class="readonly-field">
        <span class="readonly-label">Niveau</span>
        <strong>{{ niveauLabel }}</strong>
      </div>

      <div class="readonly-field">
        <span class="readonly-label">Validateur</span>
        <strong>{{ validation?.validateur_email || '-' }}</strong>
      </div>

      <div class="form-field">
        <label for="statut">Statut</label>
        <Select
          id="statut"
          v-model="form.statut"
          :options="statutOptions"
          option-label="label"
          option-value="value"
          required
        />
      </div>

      <div class="form-field">
        <label for="note_sur_20">Note / 20</label>
        <InputNumber
          id="note_sur_20"
          v-model="form.note_sur_20"
          :min="0"
          :max="20"
          :max-fraction-digits="2"
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="commentaire">Commentaire</label>
        <Textarea id="commentaire" v-model="form.commentaire" rows="4" />
      </div>

      <div class="form-field form-field-wide">
        <label for="piece_jointe">Pièce jointe</label>
        <input id="piece_jointe" type="file" class="file-input" @change="selectFile" />
        <span v-if="form.piece_jointe" class="file-hint">{{ form.piece_jointe.name }}</span>
        <a
          v-else-if="existingPieceJointeUrl"
          class="file-hint"
          :href="existingPieceJointeUrl"
          target="_blank"
          rel="noreferrer"
        >
          Document actuel
        </a>
      </div>

      <footer class="dialog-actions">
        <Button type="button" label="Annuler" severity="secondary" outlined @click="close" />
        <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="loading" />
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
:deep(.validation-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.validation-form {
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

.readonly-field {
  display: grid;
  gap: 0.35rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  padding: 0.75rem;
}

.readonly-label {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
}

.readonly-field strong {
  color: #0f172a;
  overflow-wrap: anywhere;
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
  .validation-form {
    grid-template-columns: 1fr;
  }
}
</style>
