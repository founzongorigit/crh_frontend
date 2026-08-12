<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import type {
  DomaineIntervention,
  DomaineInterventionCreatePayload,
  DomaineInterventionUpdatePayload,
} from '@/types/domaineIntervention'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  domaine: DomaineIntervention | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: DomaineInterventionCreatePayload | DomaineInterventionUpdatePayload]
}>()

const form = reactive({
  nom: '',
  code_comptable: '',
  description: '',
})

const isEditMode = computed(() => !!props.domaine)
const title = computed(() => (isEditMode.value ? 'Modifier le domaine' : 'Nouveau domaine'))

watch(
  () => [props.domaine, visible.value] as const,
  ([domaine]) => {
    if (!visible.value) return

    form.nom = domaine?.nom ?? ''
    form.code_comptable = domaine?.code_comptable ?? ''
    form.description = domaine?.description ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  emit('save', {
    nom: form.nom,
    code_comptable: form.code_comptable,
    description: form.description || null,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="domaine_nom">Nom</label>
        <InputText id="domaine_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="domaine_code">Code comptable</label>
        <InputText id="domaine_code" v-model="form.code_comptable" required />
      </div>

      <div class="form-field form-field-wide">
        <label for="domaine_description">Description</label>
        <Textarea id="domaine_description" v-model="form.description" rows="4" auto-resize />
      </div>

      <footer class="dialog-actions">
        <Button type="button" label="Annuler" severity="secondary" outlined @click="close" />
        <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="loading" />
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
:deep(.entity-dialog) { width: min(42rem, calc(100vw - 2rem)); }
.entity-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.form-field { display: grid; gap: 0.4rem; }
.form-field label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
