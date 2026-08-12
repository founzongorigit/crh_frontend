<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { getBackendFileUrl } from '@/services/api'
import type { User, UserProfileUpdatePayload } from '@/types/user'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  user: User | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: UserProfileUpdatePayload]
}>()

const form = reactive({
  email: '',
  nom: '',
  prenom: '',
  telephone: '',
  photo_profile: null as File | null,
  existing_photo_profile: '',
})

const currentPhotoUrl = computed(() => getBackendFileUrl(form.existing_photo_profile))

watch(
  () => [props.user, visible.value] as const,
  ([user]) => {
    if (!visible.value) return

    form.email = user?.email ?? ''
    form.nom = user?.nom ?? ''
    form.prenom = user?.prenom ?? ''
    form.telephone = user?.telephone ?? ''
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
  emit('save', {
    email: form.email,
    nom: form.nom,
    prenom: form.prenom,
    telephone: form.telephone || null,
    ...(form.photo_profile ? { photo_profile: form.photo_profile } : {}),
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Modifier mon profil" modal class="user-dialog">
    <form class="user-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="profile_email">Email</label>
        <InputText id="profile_email" v-model="form.email" type="email" required />
      </div>

      <div class="form-field">
        <label for="profile_nom">Nom</label>
        <InputText id="profile_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="profile_prenom">Prénom</label>
        <InputText id="profile_prenom" v-model="form.prenom" required />
      </div>

      <div class="form-field">
        <label for="profile_telephone">Téléphone</label>
        <InputText id="profile_telephone" v-model="form.telephone" />
      </div>

      <div class="form-field form-field-wide">
        <label for="profile_photo">Photo de profil</label>
        <input id="profile_photo" type="file" accept="image/*" class="file-input" @change="selectPhoto" />
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
