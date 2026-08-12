<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type {
  ProgrammeTriennal,
  ProgrammeTriennalCreatePayload,
  ProgrammeTriennalStatut,
  ProgrammeTriennalUpdatePayload,
} from '@/types/pt'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  programme: ProgrammeTriennal | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: ProgrammeTriennalCreatePayload | ProgrammeTriennalUpdatePayload]
}>()

const statutOptions: Array<{ label: string; value: ProgrammeTriennalStatut }> = [
  { label: 'En préparation', value: 'EN_PREPARATION' },
  { label: 'Actif', value: 'ACTIF' },
  { label: 'Clos', value: 'CLOS' },
]

const form = reactive({
  libelle: '',
  annee_debut: new Date().getFullYear(),
  annee_fin: new Date().getFullYear() + 2,
  budget_total: null as number | null,
  statut: 'EN_PREPARATION' as ProgrammeTriennalStatut,
})

const isEditMode = computed(() => !!props.programme)
const title = computed(() => (isEditMode.value ? 'Modifier le programme' : 'Nouveau programme'))

watch(
  () => [props.programme, visible.value] as const,
  ([programme]) => {
    if (!visible.value) return

    form.libelle = programme?.libelle ?? ''
    form.annee_debut = programme?.annee_debut ?? new Date().getFullYear()
    form.annee_fin = programme?.annee_fin ?? new Date().getFullYear() + 2
    form.budget_total = programme?.budget_total === undefined ? null : Number(programme.budget_total)
    form.statut = (programme?.statut ?? 'EN_PREPARATION') as ProgrammeTriennalStatut
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  emit('save', {
    libelle: form.libelle,
    annee_debut: form.annee_debut,
    annee_fin: form.annee_fin,
    budget_total: form.budget_total ?? 0,
    statut: form.statut,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="entity-dialog">
    <form class="entity-form" @submit.prevent="submit">
      <div class="form-field form-field-wide"><label for="pt_libelle">Libellé</label><InputText id="pt_libelle" v-model="form.libelle" required /></div>
      <div class="form-field"><label for="pt_debut">Année début</label><InputNumber id="pt_debut" v-model="form.annee_debut" :min="2000" required /></div>
      <div class="form-field"><label for="pt_fin">Année fin</label><InputNumber id="pt_fin" v-model="form.annee_fin" :min="form.annee_debut" required /></div>
      <div class="form-field"><label for="pt_budget">Budget total</label><InputNumber id="pt_budget" v-model="form.budget_total" :min="0" required /></div>
      <div class="form-field"><label for="pt_statut">Statut</label><Select id="pt_statut" v-model="form.statut" :options="statutOptions" option-label="label" option-value="value" required /></div>

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
