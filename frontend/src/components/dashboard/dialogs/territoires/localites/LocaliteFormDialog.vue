<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type {
  Localite,
  LocaliteCreatePayload,
  LocaliteUpdatePayload,
  TypeLocalite,
} from '@/types/territoires/localite'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  localite: Localite | null
  sousPrefectures?: SousPrefecture[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: LocaliteCreatePayload | LocaliteUpdatePayload]
}>()

const typeOptions: Array<{ label: string; value: TypeLocalite }> = [
  { label: 'Village', value: 'village' },
  { label: 'Campement', value: 'campement' },
  { label: 'Ville', value: 'ville' },
  { label: 'Canton', value: 'canton' },
  { label: 'Autre', value: 'autre' },
]

const statusOptions = [
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

const form = reactive({
  nom: '',
  type: 'village' as TypeLocalite,
  sous_prefecture_id: '',
  latitude: null as number | null,
  longitude: null as number | null,
  is_active: true,
})

const isEditMode = computed(() => !!props.localite)
const title = computed(() => (isEditMode.value ? 'Modifier la localité' : 'Nouvelle localité'))
const submitError = computed(() => {
  if (!form.nom.trim()) return 'Le nom est obligatoire.'
  if (!form.sous_prefecture_id) return 'La sous-préfecture est obligatoire.'

  return ''
})

watch(
  () => [props.localite, visible.value] as const,
  ([localite]) => {
    if (!visible.value) return

    form.nom = localite?.nom ?? ''
    form.type = localite?.type ?? 'village'
    form.sous_prefecture_id = localite?.sous_prefecture_id ?? ''
    form.latitude = localite?.latitude === null || localite?.latitude === undefined ? null : Number(localite.latitude)
    form.longitude =
      localite?.longitude === null || localite?.longitude === undefined ? null : Number(localite.longitude)
    form.is_active = localite?.is_active ?? true
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
    type: form.type,
    sous_prefecture_id: form.sous_prefecture_id,
    latitude: form.latitude,
    longitude: form.longitude,
    ...(isEditMode.value ? { is_active: form.is_active } : {}),
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="territory-dialog">
    <form class="territory-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="localite_nom">Nom</label>
        <InputText id="localite_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="localite_type">Type</label>
        <Select
          id="localite_type"
          v-model="form.type"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          required
        />
      </div>

      <div class="form-field">
        <label for="localite_sous_prefecture">Sous-préfecture</label>
        <Select
          id="localite_sous_prefecture"
          v-model="form.sous_prefecture_id"
          :options="sousPrefectures || []"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          required
        />
      </div>

      <div class="form-field">
        <label for="localite_latitude">Latitude</label>
        <InputNumber
          id="localite_latitude"
          v-model="form.latitude"
          :min-fraction-digits="0"
          :max-fraction-digits="6"
        />
      </div>

      <div class="form-field">
        <label for="localite_longitude">Longitude</label>
        <InputNumber
          id="localite_longitude"
          v-model="form.longitude"
          :min-fraction-digits="0"
          :max-fraction-digits="6"
        />
      </div>

      <div v-if="isEditMode" class="form-field">
        <label for="localite_status">Statut</label>
        <Select
          id="localite_status"
          v-model="form.is_active"
          :options="statusOptions"
          option-label="label"
          option-value="value"
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
:deep(.territory-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.territory-form {
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

.form-error {
  color: #b91c1c;
  font-size: 0.86rem;
  font-weight: 700;
  margin: 0;
}

.form-field-wide {
  grid-column: 1 / -1;
}

.dialog-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 760px) {
  .territory-form {
    grid-template-columns: 1fr;
  }
}
</style>
