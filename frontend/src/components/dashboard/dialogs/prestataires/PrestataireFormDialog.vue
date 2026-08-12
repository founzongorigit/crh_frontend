<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import type {
  Prestataire,
  PrestataireCreatePayload,
  PrestataireUpdatePayload,
} from '@/types/prestataire'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  prestataire: Prestataire | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: PrestataireCreatePayload | PrestataireUpdatePayload]
}>()

const form = reactive({
  raison_sociale: '',
  num_id_fiscal: '',
  siege: '',
  telephone: '',
  email: '',
  representant: '',
})

const isEditMode = computed(() => !!props.prestataire)
const title = computed(() => (isEditMode.value ? 'Modifier le prestataire' : 'Nouveau prestataire'))

watch(
  () => [props.prestataire, visible.value] as const,
  ([prestataire]) => {
    if (!visible.value) return

    form.raison_sociale = prestataire?.raison_sociale ?? ''
    form.num_id_fiscal = prestataire?.num_id_fiscal ?? ''
    form.siege = prestataire?.siege ?? ''
    form.telephone = prestataire?.telephone ?? ''
    form.email = prestataire?.email ?? ''
    form.representant = prestataire?.representant ?? ''
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  emit('save', {
    raison_sociale: form.raison_sociale,
    num_id_fiscal: form.num_id_fiscal || null,
    siege: form.siege || null,
    telephone: form.telephone || null,
    email: form.email || null,
    representant: form.representant || null,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field form-field-wide">
        <label for="prestataire_raison">Raison sociale</label>
        <InputText id="prestataire_raison" v-model="form.raison_sociale" required />
      </div>
      <div class="form-field"><label for="prestataire_nif">NIF</label><InputText id="prestataire_nif" v-model="form.num_id_fiscal" /></div>
      <div class="form-field"><label for="prestataire_siege">Siège</label><InputText id="prestataire_siege" v-model="form.siege" /></div>
      <div class="form-field"><label for="prestataire_tel">Téléphone</label><InputText id="prestataire_tel" v-model="form.telephone" /></div>
      <div class="form-field"><label for="prestataire_email">Email</label><InputText id="prestataire_email" v-model="form.email" type="email" /></div>
      <div class="form-field form-field-wide"><label for="prestataire_representant">Représentant</label><InputText id="prestataire_representant" v-model="form.representant" /></div>

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
.form-field label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .entity-form { grid-template-columns: 1fr; } }
</style>
