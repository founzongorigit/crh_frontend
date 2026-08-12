<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import type { AffectationConseillerLocalite, ConseillerLocalitesPayload } from '@/types/affectation'
import type { Localite } from '@/types/territoires/localite'
import type { User } from '@/types/user'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  conseillerId?: string | null
  users?: User[]
  localites?: Localite[]
  affectations?: AffectationConseillerLocalite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [userId: string, payload: ConseillerLocalitesPayload]
}>()

const form = reactive({
  conseiller_id: '',
  localite_ids: [] as string[],
  localite_principale_id: null as string | null,
})

const conseillerOptions = computed(() =>
  (props.users ?? []).filter((user) => user.profil === 'CONSEILLER' && user.is_active),
)

const selectedConseiller = computed(
  () => conseillerOptions.value.find((user) => user.id === form.conseiller_id) ?? null,
)

const selectedLocaliteOptions = computed(() =>
  (props.localites ?? []).filter((localite) => form.localite_ids.includes(localite.id)),
)

const title = computed(() =>
  selectedConseiller.value
    ? `Affecter ${selectedConseiller.value.prenom} ${selectedConseiller.value.nom}`
    : 'Affecter un conseiller',
)

watch(
  () => [props.conseillerId, props.affectations, visible.value] as const,
  ([conseillerId]) => {
    if (!visible.value) return

    form.conseiller_id = conseillerId ?? ''
    const affectations = (props.affectations ?? []).filter(
      (affectation) => affectation.conseiller_id === form.conseiller_id,
    )
    form.localite_ids = affectations
      .map((affectation) => affectation.localite_id)
    form.localite_principale_id =
      affectations.find((affectation) => affectation.est_principal)?.localite_id ?? null
  },
  { immediate: true },
)

watch(
  () => form.conseiller_id,
  (conseillerId) => {
    if (!visible.value) return

    const affectations = (props.affectations ?? []).filter(
      (affectation) => affectation.conseiller_id === conseillerId,
    )
    form.localite_ids = affectations
      .filter((affectation) => affectation.conseiller_id === form.conseiller_id)
      .map((affectation) => affectation.localite_id)
    form.localite_principale_id =
      affectations.find((affectation) => affectation.est_principal)?.localite_id ?? null
  },
)

watch(
  () => form.localite_ids,
  (localiteIds) => {
    if (form.localite_principale_id && !localiteIds.includes(form.localite_principale_id)) {
      form.localite_principale_id = null
    }
  },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  if (!form.conseiller_id) return

  emit('save', form.conseiller_id, {
    localite_ids: form.localite_ids,
    localite_principale_id: form.localite_principale_id,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="affectation-dialog">
    <form class="affectation-form" @submit.prevent="submit">
      <div class="form-field form-field-wide">
        <label for="affectation_conseiller_id">Conseiller</label>
        <Select
          id="affectation_conseiller_id"
          v-model="form.conseiller_id"
          :options="conseillerOptions"
          option-label="email"
          option-value="id"
          placeholder="Sélectionner un conseiller"
          filter
          required
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="affectation_localite_ids">Localités</label>
        <MultiSelect
          id="affectation_localite_ids"
          v-model="form.localite_ids"
          :options="localites"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner les localités"
          display="chip"
          filter
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="affectation_localite_principale_id">Localité principale</label>
        <Select
          id="affectation_localite_principale_id"
          v-model="form.localite_principale_id"
          :options="selectedLocaliteOptions"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner la localité principale"
          show-clear
          filter
          :disabled="form.localite_ids.length === 0"
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
:deep(.affectation-dialog) {
  width: min(42rem, calc(100vw - 2rem));
}

.affectation-form {
  display: grid;
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
</style>
