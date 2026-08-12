<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import type { Projet } from '@/types/projet'
import type { ProjetLocaliteCreatePayload } from '@/types/projetLocalite'
import type { Localite } from '@/types/territoires/localite'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  projets?: Projet[]
  localites?: Localite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: ProjetLocaliteCreatePayload]
}>()

const form = reactive({
  projet: '',
  localite: '',
})

const submitError = computed(() => {
  if (!form.projet) return 'Le projet est obligatoire.'
  if (!form.localite) return 'La localité est obligatoire.'

  return ''
})

watch(
  () => visible.value,
  () => {
    if (!visible.value) return
    form.projet = ''
    form.localite = ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  if (submitError.value) return

  emit('save', {
    projet_id: form.projet,
    localite_id: form.localite,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Ajouter une localité au projet" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="pl_projet">Projet</label>
        <Select
          id="pl_projet"
          v-model="form.projet"
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
        <label for="pl_localite">Localité</label>
        <Select
          id="pl_localite"
          v-model="form.localite"
          :options="localites"
          option-label="nom"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner une localité"
          filter
          required
        />
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
.form-control { width: 100%; }
.form-error { color: #b91c1c; font-size: 0.86rem; font-weight: 700; margin: 0; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
