<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import type { ProjetLocalite } from '@/types/projetLocalite'
import type {
  AlerteTerrainCreatePayload,
} from '@/types/alerteTerrain'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  projetLocalites?: ProjetLocalite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: AlerteTerrainCreatePayload]
}>()

const urgenceOptions = [
  { label: 'Info', value: 'INFO' },
  { label: 'Moyen', value: 'MOYEN' },
  { label: 'Urgent', value: 'URGENT' },
]

const form = reactive({
  projet_localite_id: '',
  message: '',
  niveau_urgence: 'MOYEN',
})

const projetLocaliteOptions = computed(() =>
  (props.projetLocalites ?? []).map((projetLocalite) => ({
    label: `${projetLocalite.projet_libelle} - ${projetLocalite.nom}`,
    value: projetLocalite.id,
  })),
)
const submitError = computed(() => {
  if (!form.projet_localite_id) return 'Le projet-localité est obligatoire.'
  if (!form.message.trim()) return 'Le message est obligatoire.'

  return ''
})

watch(
  () => visible.value,
  () => {
    if (!visible.value) return

    form.projet_localite_id = ''
    form.message = ''
    form.niveau_urgence = 'MOYEN'
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  if (submitError.value) return

  emit('save', {
    projet_localite_id: form.projet_localite_id,
    message: form.message,
    niveau_urgence: form.niveau_urgence,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Nouvelle alerte terrain" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="alerte_pl">Projet localité</label>
        <Select
          id="alerte_pl"
          v-model="form.projet_localite_id"
          :options="projetLocaliteOptions"
          option-label="label"
          option-value="value"
          class="form-control"
          placeholder="Sélectionner un projet-localité"
          filter
          required
        />
      </div>
      <div class="form-field"><label for="alerte_urgence">Urgence</label><Select id="alerte_urgence" v-model="form.niveau_urgence" :options="urgenceOptions" option-label="label" option-value="value" required /></div>
      <div class="form-field form-field-wide"><label for="alerte_message">Message</label><Textarea id="alerte_message" v-model="form.message" rows="4" auto-resize required /></div>

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
.form-control { width: 100%; }
.form-error { color: #b91c1c; font-size: 0.86rem; font-weight: 700; margin: 0; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
