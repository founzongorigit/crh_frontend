<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import type { AffectationVPDepartement, VPDepartementsPayload } from '@/types/affectation'
import type { Departement } from '@/types/territoires/departement'
import type { User } from '@/types/user'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  vpId?: string | null
  users?: User[]
  departements?: Departement[]
  affectations?: AffectationVPDepartement[]
  loading?: boolean
}>()  

const emit = defineEmits<{
  save: [userId: string, payload: VPDepartementsPayload]
}>()

const form = reactive({
  vice_president_id: '',
  departement_ids: [] as string[],
  departement_principal_id: null as string | null,
})

const vpOptions = computed(() =>
  (props.users ?? []).filter((user) => user.profil === 'VP' && user.is_active),
)

const selectedVP = computed(
  () => vpOptions.value.find((user) => user.id === form.vice_president_id) ?? null,
)

const selectedDepartementOptions = computed(() =>
  (props.departements ?? []).filter((departement) =>
    form.departement_ids.includes(departement.id),
  ),
)

const title = computed(() =>
  selectedVP.value
    ? `Affecter ${selectedVP.value.prenom} ${selectedVP.value.nom}`
    : 'Affecter un VP',
)

watch(
  () => [props.vpId, props.affectations, visible.value] as const,
  ([vpId]) => {
    if (!visible.value) return

    form.vice_president_id = vpId ?? ''
    const affectations = (props.affectations ?? []).filter(
      (affectation) => affectation.vice_president_id === form.vice_president_id,
    )
    form.departement_ids = affectations.map((affectation) => affectation.departement_id)
    form.departement_principal_id =
      affectations.find((affectation) => affectation.est_principal)?.departement_id ?? null
  },
  { immediate: true },
)

watch(
  () => form.vice_president_id,
  (vpId) => {
    if (!visible.value) return

    const affectations = (props.affectations ?? [])
      .filter((affectation) => affectation.vice_president_id === vpId)
    form.departement_ids = affectations.map((affectation) => affectation.departement_id)
    form.departement_principal_id =
      affectations.find((affectation) => affectation.est_principal)?.departement_id ?? null
  },
)

watch(
  () => form.departement_ids,
  (departementIds) => {
    if (
      form.departement_principal_id &&
      !departementIds.includes(form.departement_principal_id)
    ) {
      form.departement_principal_id = null
    }
  },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  if (!form.vice_president_id) return

  emit('save', form.vice_president_id, {
    departement_ids: form.departement_ids,
    departement_principal_id: form.departement_principal_id,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="affectation-dialog">
    <form class="affectation-form" @submit.prevent="submit">
      <div class="form-field form-field-wide">
        <label for="affectation_vp_id">Vice-président</label>
        <Select
          id="affectation_vp_id"
          v-model="form.vice_president_id"
          :options="vpOptions"
          option-label="email"
          option-value="id"
          placeholder="Sélectionner un VP"
          filter
          required
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="affectation_departement_ids">Départements</label>
        <MultiSelect
          id="affectation_departement_ids"
          v-model="form.departement_ids"
          :options="departements"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner les départements"
          display="chip"
          filter
        />
      </div>

      <div class="form-field form-field-wide">
        <label for="affectation_departement_principal_id">Département principal</label>
        <Select
          id="affectation_departement_principal_id"
          v-model="form.departement_principal_id"
          :options="selectedDepartementOptions"
          option-label="nom"
          option-value="id"
          placeholder="Sélectionner le département principal"
          show-clear
          filter
          :disabled="form.departement_ids.length === 0"
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
