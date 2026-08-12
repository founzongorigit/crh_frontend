<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { getBackendFileUrl } from '@/services/api'
import type {
  CahierCharges,
  CahierChargesCreatePayload,
  CahierChargesUpdatePayload,
} from '@/types/cahierCharges'
import type { TypeIntervention } from '@/types/typeIntervention'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  cahier: CahierCharges | null
  typesIntervention?: TypeIntervention[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: CahierChargesCreatePayload | CahierChargesUpdatePayload]
}>()

const form = reactive({
  type_intervention_id: '',
  fichier_pdf: null as File | null,
  version: '1.0',
  date_upload: '',
  actif: true,
  existing_fichier_pdf: '',
})

const isEditMode = computed(() => !!props.cahier)
const title = computed(() => (isEditMode.value ? 'Modifier le cahier des charges' : 'Nouveau cahier des charges'))
const existingFichierPdfUrl = computed(() => getBackendFileUrl(form.existing_fichier_pdf))
const submitError = computed(() => {
  if (!form.type_intervention_id) return "Le type d'intervention est obligatoire."
  if (!form.version.trim()) return 'La version est obligatoire.'

  return ''
})

watch(
  () => [props.cahier, visible.value] as const,
  ([cahier]) => {
    if (!visible.value) return

    form.type_intervention_id = cahier?.type_intervention_id ?? ''
    form.fichier_pdf = null
    form.version = cahier?.version ?? '1.0'
    form.date_upload = cahier?.date_upload ?? ''
    form.actif = cahier?.actif ?? true
    form.existing_fichier_pdf = cahier?.fichier_pdf ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const selectFichierPdf = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.fichier_pdf = input.files?.[0] ?? null
}

const submit = () => {
  if (submitError.value) return

  emit('save', {
    type_intervention_id: form.type_intervention_id,
    fichier_pdf: form.fichier_pdf,
    version: form.version,
    date_upload: form.date_upload || null,
    actif: form.actif,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="cahier_type">Type d'intervention</label>
        <Select id="cahier_type" v-model="form.type_intervention_id" :options="typesIntervention" option-label="nom" option-value="id" required />
      </div>
      <div class="form-field"><label for="cahier_version">Version</label><InputText id="cahier_version" v-model="form.version" required /></div>
      <div class="form-field"><label for="cahier_date">Date upload</label><InputText id="cahier_date" v-model="form.date_upload" type="date" /></div>
      <div class="form-field">
        <label for="cahier_fichier">Fichier PDF</label>
        <input
          id="cahier_fichier"
          class="file-input"
          type="file"
          accept="application/pdf"
          @change="selectFichierPdf"
        />
        <span v-if="form.fichier_pdf" class="file-hint">{{ form.fichier_pdf.name }}</span>
        <a
          v-else-if="existingFichierPdfUrl"
          class="file-hint"
          :href="existingFichierPdfUrl"
          target="_blank"
          rel="noreferrer"
        >
          Document actuel
        </a>
      </div>
      <div class="form-field form-field-wide checkbox-field">
        <Checkbox v-model="form.actif" input-id="cahier_actif" binary />
        <label for="cahier_actif">Actif</label>
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
:deep(.entity-dialog) { width: min(42rem, calc(100vw - 2rem)); }
.entity-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.form-field { display: grid; gap: 0.4rem; }
.form-field label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.checkbox-field { display: flex; align-items: center; gap: 0.5rem; }
.file-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.65rem; width: 100%; }
.file-hint { color: #475569; font-size: 0.85rem; font-weight: 700; }
.form-error { color: #b91c1c; font-size: 0.86rem; font-weight: 700; margin: 0; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
