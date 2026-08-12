<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { getBackendFileUrl } from '@/services/api'
import type { VisiteTerrainStatut } from '@/types/visiteTerrain'
import type { ProjetLocalite } from '@/types/projetLocalite'
import type {
  VisiteTerrain,
  VisiteTerrainCreatePayload,
  VisiteTerrainUpdatePayload,
} from '@/types/visiteTerrain'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  visite: VisiteTerrain | null
  projetLocalites?: ProjetLocalite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: VisiteTerrainCreatePayload | VisiteTerrainUpdatePayload]
}>()

const form = reactive({
  projet_localite_id: '',
  date_visite: '',
  taux_constate: 0,
  observations: '',
  statut_constate: 'NON_DEMARRE' as VisiteTerrainStatut,
  rapport: null as File | null,
  existing_rapport_url: '',
})

const visiteTerrainStatutOptions: Array<{ label: string; value: VisiteTerrainStatut }> = [
  { label: 'Non démarré', value: 'NON_DEMARRE' },
  { label: 'En cours', value: 'EN_COURS' },
  { label: 'Suspendu', value: 'SUSPENDU' },
  { label: 'Achevé', value: 'ACHEVE' },
]

const isEditMode = computed(() => !!props.visite)
const title = computed(() => (isEditMode.value ? 'Modifier la visite terrain' : 'Nouvelle visite terrain'))
const existingRapportUrl = computed(() => getBackendFileUrl(form.existing_rapport_url))
const projetLocaliteOptions = computed(() =>
  (props.projetLocalites ?? []).map((projetLocalite) => ({
    label: `${projetLocalite.projet_libelle} - ${projetLocalite.nom}`,
    value: projetLocalite.id,
  })),
)
const submitError = computed(() => {
  if (!form.projet_localite_id) return 'Le projet-localité est obligatoire.'
  if (!form.date_visite) return 'La date de visite est obligatoire.'

  return ''
})

watch(
  () => [props.visite, visible.value] as const,
  ([visite]) => {
    if (!visible.value) return

    form.projet_localite_id = visite?.projet_localite_id ?? ''
    form.date_visite = visite?.date_visite ?? ''
    form.taux_constate = Number(visite?.taux_constate ?? 0)
    form.observations = visite?.observations ?? ''
    form.statut_constate = visite?.statut_constate ?? 'NON_DEMARRE'
    form.rapport = null
    form.existing_rapport_url = visite?.rapport_url ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const selectRapport = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.rapport = input.files?.[0] ?? null
}

const submit = () => {
  if (submitError.value) return

  emit('save', {
    projet_localite_id: form.projet_localite_id,
    date_visite: form.date_visite,
    taux_constate: form.taux_constate,
    observations: form.observations || null,
    statut_constate: form.statut_constate || null,
    rapport: form.rapport,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="visite_pl">Projet localité</label>
        <Select
          id="visite_pl"
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
      <div class="form-field"><label for="visite_date">Date visite</label><InputText id="visite_date" v-model="form.date_visite" type="date" required /></div>
      <div class="form-field"><label for="visite_taux">Taux constaté</label><InputNumber id="visite_taux" v-model="form.taux_constate" :min="0" :max="100" required /></div>
      <div class="form-field">
        <label for="visite_statut">Statut constaté</label>
        <Select
          id="visite_statut"
          v-model="form.statut_constate"
          :options="visiteTerrainStatutOptions"
          option-label="label"
          option-value="value"
          class="form-control"
          placeholder="Sélectionner un statut"
        />
      </div>
      <div class="form-field">
        <label for="visite_rapport">Rapport</label>
        <input id="visite_rapport" class="file-input" type="file" @change="selectRapport" />
        <span v-if="form.rapport" class="file-hint">{{ form.rapport.name }}</span>
        <a
          v-else-if="existingRapportUrl"
          class="file-hint"
          :href="existingRapportUrl"
          target="_blank"
          rel="noreferrer"
        >
          Document actuel
        </a>
      </div>
      <div class="form-field form-field-wide"><label for="visite_observations">Observations</label><Textarea id="visite_observations" v-model="form.observations" rows="4" auto-resize /></div>

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
.file-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.65rem; width: 100%; }
.file-hint { color: #475569; font-size: 0.85rem; font-weight: 700; }
.form-error { color: #b91c1c; font-size: 0.86rem; font-weight: 700; margin: 0; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
