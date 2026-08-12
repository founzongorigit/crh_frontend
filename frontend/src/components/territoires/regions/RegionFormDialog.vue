<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { Localite } from '@/types/territoires/localite'
import type { Region, RegionCreatePayload, RegionUpdatePayload } from '@/types/territoires/region'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  region: Region | null
  localites?: Localite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: RegionCreatePayload | RegionUpdatePayload]
}>()

const statusOptions = [
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

const form = reactive({
  nom: '',
  chef_lieu_id: '',
  is_active: true,
})

const isEditMode = computed(() => !!props.region)
const title = computed(() => (isEditMode.value ? 'Modifier la région' : 'Nouvelle région'))

watch(
  () => [props.region, visible.value] as const,
  ([region]) => {
    if (!visible.value) return

    form.nom = region?.nom ?? ''
    form.chef_lieu_id = region?.chef_lieu_id ?? ''
    form.is_active = region?.is_active ?? true
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  emit('save', {
    nom: form.nom,
    chef_lieu_id: form.chef_lieu_id || null,
    ...(isEditMode.value ? { is_active: form.is_active } : {}),
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="territory-dialog">
    <form class="territory-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="region_nom">Nom</label>
        <InputText id="region_nom" v-model="form.nom" required />
      </div>

      <div class="form-field">
        <label for="region_chef_lieu">Chef-lieu</label>
        <Select
          id="region_chef_lieu"
          v-model="form.chef_lieu_id"
          :options="localites || []"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner"
          show-clear
        />
      </div>

      <div v-if="isEditMode" class="form-field">
        <label for="region_status">Statut</label>
        <Select
          id="region_status"
          v-model="form.is_active"
          :options="statusOptions"
          option-label="label"
          option-value="value"
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
:deep(.territory-dialog) {
  width: min(38rem, calc(100vw - 2rem));
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
