<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import type { DomaineIntervention } from '@/types/domaineIntervention'
import type {
  TypeIntervention,
  TypeInterventionCreatePayload,
  TypeInterventionUpdatePayload,
} from '@/types/typeIntervention'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  typeIntervention: TypeIntervention | null
  domaines?: DomaineIntervention[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: TypeInterventionCreatePayload | TypeInterventionUpdatePayload]
}>()

const form = reactive({
  nom: '',
  domaine_id: '',
  code_comptable: '',
  description: '',
})

const isEditMode = computed(() => !!props.typeIntervention)
const title = computed(() => (isEditMode.value ? "Modifier le type d'intervention" : "Nouveau type d'intervention"))
const submitError = computed(() => {
  if (!form.nom.trim()) return 'Le nom est obligatoire.'
  if (!form.domaine_id) return 'Le domaine est obligatoire.'

  return ''
})

watch(
  () => [props.typeIntervention, visible.value] as const,
  ([typeIntervention]) => {
    if (!visible.value) return

    form.nom = typeIntervention?.nom ?? ''
    form.domaine_id = typeIntervention?.domaine_id ?? ''
    form.code_comptable = typeIntervention?.code_comptable ?? ''
    form.description = typeIntervention?.description ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  if (submitError.value) return

  emit('save', {
    nom: form.nom,
    domaine_id: form.domaine_id,
    code_comptable: form.code_comptable || null,
    description: form.description || null,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="type_nom">Nom</label>
        <InputText id="type_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="type_domaine">Domaine</label>
        <Select id="type_domaine" v-model="form.domaine_id" :options="domaines" option-label="nom" option-value="id" required />
      </div>

      <div class="form-field">
        <label for="type_code">Code comptable</label>
        <InputText id="type_code" v-model="form.code_comptable" />
      </div>

      <div class="form-field form-field-wide">
        <label for="type_description">Description</label>
        <Textarea id="type_description" v-model="form.description" rows="4" auto-resize />
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
.form-error { color: #b91c1c; font-size: 0.86rem; font-weight: 700; margin: 0; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
