<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type {
  Departement,
  DepartementCreatePayload,
  DepartementUpdatePayload,
} from '@/types/territoires/departement'
import type { Localite } from '@/types/territoires/localite'
import type { Region } from '@/types/territoires/region'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  departement: Departement | null
  regions?: Region[]
  localites?: Localite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: DepartementCreatePayload | DepartementUpdatePayload]
}>()

const statusOptions = [
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

const form = reactive({
  nom: '',
  region_id: '',
  chef_lieu_id: '',
  is_active: true,
})

const isEditMode = computed(() => !!props.departement)
const title = computed(() => (isEditMode.value ? 'Modifier le département' : 'Nouveau département'))
const submitError = computed(() => {
  if (!form.nom.trim()) return 'Le nom est obligatoire.'
  if (!form.region_id) return 'La région est obligatoire.'

  return ''
})

watch(
  () => [props.departement, visible.value] as const,
  ([departement]) => {
    if (!visible.value) return

    form.nom = departement?.nom ?? ''
    form.region_id = departement?.region_id ?? ''
    form.chef_lieu_id = departement?.chef_lieu_id ?? ''
    form.is_active = departement?.is_active ?? true
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
    region_id: form.region_id,
    chef_lieu_id: form.chef_lieu_id || null,
    ...(isEditMode.value ? { is_active: form.is_active } : {}),
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="territory-dialog">
    <form class="territory-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="departement_nom">Nom</label>
        <InputText id="departement_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="departement_region">Région</label>
        <Select
          id="departement_region"
          v-model="form.region_id"
          :options="regions || []"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          required
        />
      </div>

      <div class="form-field">
        <label for="departement_chef_lieu">Chef-lieu</label>
        <Select
          id="departement_chef_lieu"
          v-model="form.chef_lieu_id"
          :options="localites || []"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          show-clear
        />
      </div>

      <div v-if="isEditMode" class="form-field">
        <label for="departement_status">Statut</label>
        <Select
          id="departement_status"
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
