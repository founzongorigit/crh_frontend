<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import type { Prestataire } from '@/types/prestataire'
import type { ProgrammeTriennal } from '@/types/pt'
import type {
  Projet,
  ProjetCreatePayload,
  ProjetSourceFinancement,
  ProjetStatut,
  ProjetUpdatePayload,
} from '@/types/projet'
import type { Localite } from '@/types/territoires/localite'
import type { TypeIntervention } from '@/types/typeIntervention'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  projet: Projet | null
  programmes?: ProgrammeTriennal[]
  typesIntervention?: TypeIntervention[]
  prestataires?: Prestataire[]
  localites?: Localite[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: ProjetCreatePayload | ProjetUpdatePayload]
}>()

const sourceFinancementOptions: Array<{ label: string; value: ProjetSourceFinancement }> = [
  { label: "Fonds d'investissement", value: 'FI' },
  { label: 'Subvention État', value: 'SEE' },
  { label: 'Mixte', value: 'MIXTE' },
]

const projetStatutOptions: Array<{ label: string; value: ProjetStatut }> = [
  { label: 'Planifié', value: 'PLANIFIE' },
  { label: 'En cours', value: 'EN_COURS' },
  { label: 'En validation', value: 'EN_VALIDATION' },
  { label: 'Validé', value: 'VALIDE' },
  { label: 'Payé partiellement', value: 'PAYE_PARTIELLEMENT' },
  { label: 'Achevé', value: 'ACHEVE' },
  { label: 'Suspendu', value: 'SUSPENDU' },
]

const form = reactive({
  programme_id: '',
  type_intervention_id: '',
  libelle_officiel: '',
  code_comptable: '',
  cout_total: null as number | null,
  depense_anterieure: 0,
  cout_n: 0,
  cout_n1: 0,
  cout_n2: 0,
  subvention_n: 0,
  subvention_n1: 0,
  subvention_n2: 0,
  source_financement: 'FI' as ProjetSourceFinancement,
  statut: 'PLANIFIE' as ProjetStatut,
  prestataire_id: '',
  delai_realisation_jours: null as number | null,
  date_debut_prevu: '',
  localite_ids: [] as string[],
})

const submitError = computed(() => {
  if (!form.programme_id) return 'Le programme est obligatoire.'
  if (!form.type_intervention_id) return "Le type d'intervention est obligatoire."
  if (!form.libelle_officiel.trim()) return 'Le libellé officiel est obligatoire.'
  if (form.cout_total === null) return 'Le coût total est obligatoire.'
  if (form.localite_ids.length === 0) return 'Au moins une localité est obligatoire.'

  return ''
})

const isEditMode = computed(() => !!props.projet)
const title = computed(() => (isEditMode.value ? 'Modifier le projet' : 'Nouveau projet'))

watch(
  () => [props.projet, visible.value] as const,
  ([projet]) => {
    if (!visible.value) return

    form.programme_id = projet?.programme_id ?? ''
    form.type_intervention_id = projet?.type_intervention_id ?? ''
    form.libelle_officiel = projet?.libelle_officiel ?? ''
    form.code_comptable = projet?.code_comptable ?? ''
    form.cout_total = projet?.cout_total === undefined ? null : Number(projet.cout_total)
    form.depense_anterieure = Number(projet?.depense_anterieure ?? 0)
    form.cout_n = Number(projet?.cout_n ?? 0)
    form.cout_n1 = Number(projet?.cout_n1 ?? 0)
    form.cout_n2 = Number(projet?.cout_n2 ?? 0)
    form.subvention_n = Number(projet?.subvention_n ?? 0)
    form.subvention_n1 = Number(projet?.subvention_n1 ?? 0)
    form.subvention_n2 = Number(projet?.subvention_n2 ?? 0)
    form.source_financement = projet?.source_financement ?? 'FI'
    form.statut = projet?.statut ?? 'PLANIFIE'
    form.prestataire_id = projet?.prestataire_id ?? ''
    form.delai_realisation_jours = projet?.delai_realisation_jours ?? null
    form.date_debut_prevu = projet?.date_debut_prevu ?? ''
    form.localite_ids = projet?.localite_ids ?? []
  },
  { immediate: true },
)

const close = () => {
  visible.value = false
}

const submit = () => {
  if (submitError.value) return

  emit('save', {
    programme_id: form.programme_id,
    type_intervention_id: form.type_intervention_id,
    libelle_officiel: form.libelle_officiel,
    code_comptable: form.code_comptable || null,
    cout_total: form.cout_total ?? 0,
    depense_anterieure: form.depense_anterieure,
    cout_n: form.cout_n,
    cout_n1: form.cout_n1,
    cout_n2: form.cout_n2,
    subvention_n: form.subvention_n,
    subvention_n1: form.subvention_n1,
    subvention_n2: form.subvention_n2,
    source_financement: form.source_financement,
    prestataire_id: form.prestataire_id || null,
    delai_realisation_jours: form.delai_realisation_jours,
    date_debut_prevu: form.date_debut_prevu || null,
    localite_ids: form.localite_ids,
  })
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="title" modal class="projet-dialog">
    <form class="projet-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="projet_programme">Programme</label>
        <Select
          id="projet_programme"
          v-model="form.programme_id"
          :options="programmes"
          option-label="libelle"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner un programme"
          filter
          required
        />
      </div>
      <div class="form-field">
        <label for="projet_type">Type intervention</label>
        <Select
          id="projet_type"
          v-model="form.type_intervention_id"
          :options="typesIntervention"
          option-label="nom"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner un type"
          filter
          required
        />
      </div>
      <div class="form-field form-field-wide"><label for="projet_libelle">Libellé officiel</label><InputText id="projet_libelle" v-model="form.libelle_officiel" required /></div>
      <div class="form-field"><label for="projet_code">Code comptable</label><InputText id="projet_code" v-model="form.code_comptable" /></div>
      <div class="form-field">
        <label for="projet_source">Source financement</label>
        <Select
          id="projet_source"
          v-model="form.source_financement"
          :options="sourceFinancementOptions"
          option-label="label"
          option-value="value"
          class="form-control"
          required
        />
      </div>
      <div class="form-field">
        <label for="projet_statut">Statut</label>
        <Select
          id="projet_statut"
          v-model="form.statut"
          :options="projetStatutOptions"
          option-label="label"
          option-value="value"
          class="form-control"
          disabled
        />
      </div>
      <div class="form-field"><label for="projet_cout">Coût total</label><InputNumber id="projet_cout" v-model="form.cout_total" :min="0" required /></div>
      <div class="form-field"><label for="projet_depense">Dépense antérieure</label><InputNumber id="projet_depense" v-model="form.depense_anterieure" :min="0" /></div>
      <div class="form-field"><label for="projet_cout_n">Coût N</label><InputNumber id="projet_cout_n" v-model="form.cout_n" :min="0" /></div>
      <div class="form-field"><label for="projet_cout_n1">Coût N+1</label><InputNumber id="projet_cout_n1" v-model="form.cout_n1" :min="0" /></div>
      <div class="form-field"><label for="projet_cout_n2">Coût N+2</label><InputNumber id="projet_cout_n2" v-model="form.cout_n2" :min="0" /></div>
      <div class="form-field"><label for="projet_sub_n">Subvention N</label><InputNumber id="projet_sub_n" v-model="form.subvention_n" :min="0" /></div>
      <div class="form-field"><label for="projet_sub_n1">Subvention N+1</label><InputNumber id="projet_sub_n1" v-model="form.subvention_n1" :min="0" /></div>
      <div class="form-field"><label for="projet_sub_n2">Subvention N+2</label><InputNumber id="projet_sub_n2" v-model="form.subvention_n2" :min="0" /></div>
      <div class="form-field">
        <label for="projet_prestataire">Prestataire</label>
        <Select
          id="projet_prestataire"
          v-model="form.prestataire_id"
          :options="prestataires"
          option-label="raison_sociale"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner un prestataire"
          show-clear
          filter
        />
      </div>
      <div class="form-field"><label for="projet_delai">Délai jours</label><InputNumber id="projet_delai" v-model="form.delai_realisation_jours" :min="0" /></div>
      <div class="form-field"><label for="projet_date">Date début prévu</label><InputText id="projet_date" v-model="form.date_debut_prevu" type="date" /></div>
      <div class="form-field form-field-wide">
        <label for="projet_localites">Localités</label>
        <MultiSelect
          id="projet_localites"
          v-model="form.localite_ids"
          :options="localites"
          option-label="nom"
          option-value="id"
          class="form-control"
          placeholder="Sélectionner les localités"
          filter
          display="chip"
          required
        />
      </div>

      <p v-if="submitError" class="form-error form-field-wide" role="alert">
        {{ submitError }}
      </p>

      <footer class="dialog-actions">
        <Button type="button" label="Annuler" severity="secondary" outlined @click="close" />
        <Button
          type="submit"
          label="Enregistrer"
          icon="pi pi-check"
          :loading="loading"
          :disabled="Boolean(submitError)"
        />
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
:deep(.projet-dialog) { width: min(58rem, calc(100vw - 2rem)); }
.projet-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.form-field { display: grid; gap: 0.4rem; }
.form-field label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.form-control { width: 100%; }
.form-error { color: #b91c1c; font-size: 0.86rem; font-weight: 700; margin: 0; }
.form-field-wide, .dialog-actions { grid-column: 1 / -1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
@media (max-width: 760px) { .projet-form { grid-template-columns: 1fr; } }
</style>
