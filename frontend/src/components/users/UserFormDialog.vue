<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import type { Departement } from '@/types/territoires/departement'
import type { Localite } from '@/types/territoires/localite'
import type { SousPrefecture } from '@/types/territoires/sous_prefecture'
import type { Profil, User, UserCreatePayload, UserUpdatePayload } from '@/types/user'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  user: User | null
  sousPrefectures?: SousPrefecture[]
  departements?: Departement[]
  localites?: Localite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: UserCreatePayload | UserUpdatePayload]
}>()

const profilOptions: Array<{ label: string; value: Profil }> = [
  { label: 'Conseiller', value: 'CONSEILLER' },
  { label: 'Vice-Président', value: 'VP' },
  { label: 'Président', value: 'PRESIDENT' },
  { label: 'DG', value: 'DG' },
  { label: 'DGA', value: 'DGA' },
  { label: 'DT', value: 'DT' },
  { label: 'DAF', value: 'DAF' },
  { label: 'Sous-préfet', value: 'SOUS_PREFET' },
  { label: 'Administrateur', value: 'ADMIN' },
]

const form = reactive({
  email: '',
  password: '',
  nom: '',
  prenom: '',
  telephone: '',
  profil: 'CONSEILLER' as Profil,
  sous_prefecture_id: '',
  departement_id: '',
  localite_ids: [] as string[],
  photo_profile: null as File | null,
  existing_photo_profile: '',
})

const isEditMode = computed(() => !!props.user)
const title = computed(() => (isEditMode.value ? "Modifier l'utilisateur" : 'Nouvel utilisateur'))

watch(
  () => [props.user, visible.value] as const,
  ([user]) => {
    if (!visible.value) return

    form.email = user?.email ?? ''
    form.password = ''
    form.nom = user?.nom ?? ''
    form.prenom = user?.prenom ?? ''
    form.telephone = user?.telephone ?? ''
    form.profil = user?.profil ?? 'CONSEILLER'
    form.sous_prefecture_id = user?.sous_prefecture_id ?? ''
    form.departement_id = user?.departement_id ?? ''
    form.localite_ids = user?.localite_ids ?? []
    form.photo_profile = null
    form.existing_photo_profile = user?.photo_profile ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const selectPhoto = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.photo_profile = input.files?.[0] ?? null
}

const submit = () => {
  const payload = {
    nom: form.nom,
    prenom: form.prenom,
    telephone: form.telephone || null,
    profil: form.profil,
    sous_prefecture_id: form.sous_prefecture_id || null,
    departement_id: form.departement_id || null,
    localite_ids: form.localite_ids,
    ...(form.photo_profile ? { photo_profile: form.photo_profile } : {}),
    ...(isEditMode.value ? {} : { email: form.email, password: form.password }),
  }

  emit('save', payload)
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="user-dialog">
    <form class="user-form" @submit.prevent="submit">
      <div v-if="!isEditMode" class="form-field">
        <label for="user_email">Email</label>
        <InputText id="user_email" v-model="form.email" type="email" required />
      </div>

      <div v-if="!isEditMode" class="form-field">
        <label for="user_password">Mot de passe</label>
        <InputText id="user_password" v-model="form.password" type="password" required />
      </div>

      <div class="form-field">
        <label for="user_nom">Nom</label>
        <InputText id="user_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="user_prenom">Prénom</label>
        <InputText id="user_prenom" v-model="form.prenom" required />
      </div>

      <div class="form-field">
        <label for="user_telephone">Téléphone</label>
        <InputText id="user_telephone" v-model="form.telephone" />
      </div>

      <div class="form-field">
        <label for="user_profil">Profil</label>
        <Select
          id="user_profil"
          v-model="form.profil"
          :options="profilOptions"
          option-label="label"
          option-value="value"
          required
        />
      </div>

      <div class="form-field">
        <label for="user_sous_prefecture_id">Sous-préfecture</label>
        <Select
          id="user_sous_prefecture_id"
          v-model="form.sous_prefecture_id"
          :options="sousPrefectures"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          show-clear
        />
      </div>

      <div class="form-field">
        <label for="user_departement_id">Département</label>
        <Select
          id="user_departement_id"
          v-model="form.departement_id"
          :options="departements"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          show-clear
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="user_localite_ids">Localités</label>
        <MultiSelect
          id="user_localite_ids"
          v-model="form.localite_ids"
          :options="localites"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          display="chip"
          filter
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="user_photo_profile">Photo de profil</label>
        <input id="user_photo_profile" type="file" accept="image/*" class="file-input" @change="selectPhoto" />
        <span v-if="form.photo_profile" class="file-hint">{{ form.photo_profile.name }}</span>
        <a
          v-else-if="form.existing_photo_profile"
          class="file-hint"
          :href="form.existing_photo_profile"
          target="_blank"
          rel="noreferrer"
        >
          Photo actuelle
        </a>
      </div>

      <footer class="dialog-actions">
        <Button type="button" label="Annuler" severity="secondary" outlined @click="close" />
        <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="loading" />
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
:deep(.user-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.user-form {
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

.file-input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  background: #ffffff;
}

.file-hint {
  color: #475569;
  font-size: 0.85rem;
  font-weight: 700;
}

.form-field-wide,
.dialog-actions {
  grid-column: 1 / -1;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 760px) {
  .user-form {
    grid-template-columns: 1fr;
  }
}
</style>
