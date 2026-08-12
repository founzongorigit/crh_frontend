<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { getBackendFileUrl } from '@/services/api'
import type { Profil, User, UserCreatePayload, UserUpdatePayload } from '@/types/user'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  user: User | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: UserCreatePayload | UserUpdatePayload]
}>()

const PASSWORD_MIN_LENGTH = 8

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
  password_confirmation: '',
  nom: '',
  prenom: '',
  telephone: '',
  profil: 'CONSEILLER' as Profil,
  photo_profile: null as File | null,
  existing_photo_profile: '',
})

const passwordVisibility = reactive({
  password: false,
  confirmation: false,
})

const isEditMode = computed(() => !!props.user)
const title = computed(() => (isEditMode.value ? "Modifier l'utilisateur" : 'Nouvel utilisateur'))
const currentPhotoUrl = computed(() => getBackendFileUrl(form.existing_photo_profile))
const passwordTooShort = computed(
  () => !isEditMode.value && form.password !== '' && form.password.length < PASSWORD_MIN_LENGTH,
)
const passwordMismatch = computed(
  () => !isEditMode.value && form.password_confirmation !== '' && form.password !== form.password_confirmation,
)
const passwordInvalid = computed(() => passwordTooShort.value || passwordMismatch.value)

watch(
  () => [props.user, visible.value] as const,
  ([user]) => {
    if (!visible.value) return

    form.email = user?.email ?? ''
    form.password = ''
    form.password_confirmation = ''
    form.nom = user?.nom ?? ''
    form.prenom = user?.prenom ?? ''
    form.telephone = user?.telephone ?? ''
    form.profil = user?.profil ?? 'CONSEILLER'
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

const togglePasswordVisibility = (field: 'password' | 'confirmation') => {
  passwordVisibility[field] = !passwordVisibility[field]
}

const submit = () => {
  if (!isEditMode.value && form.password.length < PASSWORD_MIN_LENGTH) return
  if (!isEditMode.value && form.password !== form.password_confirmation) return

  const payload = {
    email: form.email,
    nom: form.nom,
    prenom: form.prenom,
    telephone: form.telephone || null,
    profil: form.profil,
    ...(form.photo_profile ? { photo_profile: form.photo_profile } : {}),
    ...(isEditMode.value ? {} : { password: form.password }),
  }

  emit('save', payload)
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="user-dialog">
    <form class="user-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="user_email">Email</label>
        <InputText id="user_email" v-model="form.email" type="email" required />
      </div>

      <div v-if="!isEditMode" class="form-field">
        <label for="user_password">Mot de passe</label>
        <div class="password-input">
          <InputText
            id="user_password"
            v-model="form.password"
            :type="passwordVisibility.password ? 'text' : 'password'"
            required
            :minlength="PASSWORD_MIN_LENGTH"
            :invalid="passwordTooShort"
          />
          <button
            type="button"
            class="password-toggle"
            :aria-label="passwordVisibility.password ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            @click="togglePasswordVisibility('password')"
          >
            <i :class="passwordVisibility.password ? 'pi pi-eye-slash' : 'pi pi-eye'" />
          </button>
        </div>
        <small v-if="passwordTooShort" class="field-error">
          Le mot de passe doit contenir au moins {{ PASSWORD_MIN_LENGTH }} caractères.
        </small>
      </div>

      <div v-if="!isEditMode" class="form-field">
        <label for="user_password_confirmation">Confirmation mot de passe</label>
        <div class="password-input">
          <InputText
            id="user_password_confirmation"
            v-model="form.password_confirmation"
            :type="passwordVisibility.confirmation ? 'text' : 'password'"
            required
            :invalid="passwordMismatch"
          />
          <button
            type="button"
            class="password-toggle"
            :aria-label="
              passwordVisibility.confirmation
                ? 'Masquer la confirmation du mot de passe'
                : 'Afficher la confirmation du mot de passe'
            "
            @click="togglePasswordVisibility('confirmation')"
          >
            <i :class="passwordVisibility.confirmation ? 'pi pi-eye-slash' : 'pi pi-eye'" />
          </button>
        </div>
        <small v-if="passwordMismatch" class="field-error">Les mots de passe ne correspondent pas.</small>
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

      <div class="form-field form-field-wide">
        <label for="user_photo_profile">Photo de profil</label>
        <input id="user_photo_profile" type="file" accept="image/*" class="file-input" @change="selectPhoto" />
        <span v-if="form.photo_profile" class="file-hint">{{ form.photo_profile.name }}</span>
        <a
          v-else-if="currentPhotoUrl"
          class="file-hint"
          :href="currentPhotoUrl"
          target="_blank"
          rel="noreferrer"
        >
          Photo actuelle
        </a>
      </div>

      <footer class="dialog-actions">
        <Button type="button" label="Annuler" severity="secondary" outlined @click="close" />
        <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="loading" :disabled="passwordInvalid" />
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

.password-input {
  position: relative;
  width: 100%;
}

.password-input :deep(.p-inputtext) {
  width: 100%;
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.35rem;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transform: translateY(-50%);
}

.password-toggle:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.password-toggle i {
  font-size: 0.95rem;
  line-height: 1;
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

.field-error {
  color: #dc2626;
  font-size: 0.78rem;
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
