<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { User } from '@/types/user'
import type { Departement } from '@/types/territoires/departement'
import type { Localite } from '@/types/territoires/localite'
import type {
  SousPrefecture,
  SousPrefectureCreatePayload,
  SousPrefectureUpdatePayload,
} from '@/types/territoires/sous_prefecture'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  sousPrefecture: SousPrefecture | null
  departements?: Departement[]
  localites?: Localite[]
  sousPrefets?: User[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: SousPrefectureCreatePayload | SousPrefectureUpdatePayload]
}>()

const statusOptions = [
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

const form = reactive({
  nom: '',
  departement_id: '',
  chef_lieu_id: '',
  sous_prefet_id: '',
  is_active: true,
})

const isEditMode = computed(() => !!props.sousPrefecture)
const title = computed(() =>
  isEditMode.value ? 'Modifier la sous-préfecture' : 'Nouvelle sous-préfecture',
)
const submitError = computed(() => {
  if (!form.nom.trim()) return 'Le nom est obligatoire.'
  if (!form.departement_id) return 'Le département est obligatoire.'

  return ''
})

watch(
  () => [props.sousPrefecture, visible.value] as const,
  ([sousPrefecture]) => {
    if (!visible.value) return

    form.nom = sousPrefecture?.nom ?? ''
    form.departement_id = sousPrefecture?.departement_id ?? ''
    form.chef_lieu_id = sousPrefecture?.chef_lieu_id ?? ''
    form.sous_prefet_id = sousPrefecture?.sous_prefet_id ?? ''
    form.is_active = sousPrefecture?.is_active ?? true
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
    departement_id: form.departement_id,
    chef_lieu_id: form.chef_lieu_id || null,
    sous_prefet_id: form.sous_prefet_id || null,
    ...(isEditMode.value ? { is_active: form.is_active } : {}),
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="territory-dialog">
    <form class="territory-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="sous_prefecture_nom">Nom</label>
        <InputText id="sous_prefecture_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="sous_prefecture_departement">Département</label>
        <Select
          id="sous_prefecture_departement"
          v-model="form.departement_id"
          :options="departements || []"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          required
        />
      </div>

      <div class="form-field">
        <label for="sous_prefecture_chef_lieu">Chef-lieu</label>
        <Select
          id="sous_prefecture_chef_lieu"
          v-model="form.chef_lieu_id"
          :options="localites || []"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          show-clear
        />
      </div>

      <div class="form-field">
        <label for="sous_prefet">Sous-préfet</label>
        <Select
          id="sous_prefet"
          v-model="form.sous_prefet_id"
          :options="sousPrefets || []"
          option-label="email"
          option-value="id"
          placeholder="Sélectionner"
          show-clear
        />
      </div>

      <div v-if="isEditMode" class="form-field">
        <label for="sous_prefecture_status">Statut</label>
        <Select
          id="sous_prefecture_status"
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
