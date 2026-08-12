<script setup lang="ts">
import { reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import type { AlerteTerrain, AlerteTerrainUpdatePayload } from '@/types/alerteTerrain'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  alerte: AlerteTerrain | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: AlerteTerrainUpdatePayload]
}>()

const traitementOptions = [
  { label: 'Non traité', value: 'NON_TRAITE' },
  { label: 'En cours', value: 'EN_COURS' },
  { label: 'Traité', value: 'TRAITE' },
]

const form = reactive({
  statut_traitement: 'NON_TRAITE',
})

watch(
  () => [props.alerte, visible.value] as const,
  ([alerte]) => {
    if (!visible.value) return

    form.statut_traitement = alerte?.statut_traitement ?? 'NON_TRAITE'
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  emit('save', {
    statut_traitement: form.statut_traitement,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Traiter l'alerte terrain" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="readonly-field form-field-wide">
        <span class="readonly-label">Projet</span>
        <strong>{{ alerte?.projet_libelle || '-' }}</strong>
      </div>

      <div class="readonly-field">
        <span class="readonly-label">Localité</span>
        <strong>{{ alerte?.localite_nom || '-' }}</strong>
      </div>

      <div class="readonly-field">
        <span class="readonly-label">Émetteur</span>
        <strong>{{ alerte?.emetteur_email || '-' }}</strong>
      </div>

      <div class="readonly-field form-field-wide">
        <span class="readonly-label">Message</span>
        <strong>{{ alerte?.message || '-' }}</strong>
      </div>

      <div class="form-field form-field-wide">
        <label for="alerte_traitement_statut">Statut de traitement</label>
        <Select
          id="alerte_traitement_statut"
          v-model="form.statut_traitement"
          :options="traitementOptions"
          option-label="label"
          option-value="value"
          required
        />
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
.form-field label,
.readonly-label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.readonly-field { display: grid; gap: 0.35rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; padding: 0.75rem; }
.readonly-field strong { color: #0f172a; overflow-wrap: anywhere; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
