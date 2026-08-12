<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import type { Projet, ProjetDetail } from '@/types/projet'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  projet: Projet | ProjetDetail | null
}>()

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const formatMontant = (montant: string | number | undefined) =>
  montant === undefined ? '-' : new Intl.NumberFormat('fr-FR').format(Number(montant))

const sourceFinancementLabels: Record<string, string> = {
  FI: "Fonds d'investissement",
  SEE: 'Subvention État',
  MIXTE: 'Mixte',
}

const statutLabels: Record<string, string> = {
  PLANIFIE: 'Planifié',
  EN_COURS: 'En cours',
  EN_VALIDATION: 'En validation',
  VALIDE: 'Validé',
  PAYE_PARTIELLEMENT: 'Payé partiellement',
  ACHEVE: 'Achevé',
  SUSPENDU: 'Suspendu',
}
const getProjetStatutSeverity = (statut: Projet['statut']) => {
  if (statut === 'PLANIFIE') return 'secondary'
  if (statut === 'EN_COURS') return 'warn'
  if (statut === 'EN_VALIDATION') return 'warn'
  if (statut === 'VALIDE') return 'success'
  if (statut === 'PAYE_PARTIELLEMENT') return 'info'
  if (statut === 'ACHEVE') return 'success'
  if (statut === 'SUSPENDU') return 'danger'

  return 'secondary'
}

const formatSourceFinancement = (source: Projet['source_financement']) =>
  sourceFinancementLabels[source] ?? source

const formatStatut = (statut: Projet['statut']) => statutLabels[statut] ?? statut

const close = () => {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Détail du projet" modal class="projet-dialog" dismissable-mask>
    <div v-if="projet" class="projet-details">
      <div class="details-wide"><span class="detail-label">Projet</span><strong>{{ projet.libelle_officiel }}</strong></div>
      <div><span class="detail-label">Programme</span><strong>{{ projet.programme_libelle }}</strong></div>
      <div><span class="detail-label">Domaine</span><strong>{{ projet.domaine_nom }}</strong></div>
      <div><span class="detail-label">Type intervention</span><strong>{{ projet.type_intervention_nom }}</strong></div>
      <div><span class="detail-label">Code comptable</span><strong>{{ projet.code_comptable || '-' }}</strong></div>
      <div><span class="detail-label">Coût total</span><strong>{{ formatMontant(projet.cout_total) }}</strong></div>
      <div><span class="detail-label">Source</span><strong>{{ formatSourceFinancement(projet.source_financement) }}</strong></div>
      <div><span class="detail-label">Statut</span><Tag :value="formatStatut(projet.statut)" :severity="getProjetStatutSeverity(projet.statut)" /></div>
      <div><span class="detail-label">Taux réalisation</span><strong>{{ projet.taux_realisation }}%</strong></div>
      <div><span class="detail-label">Note globale</span><strong>{{ projet.note_globale ?? '-' }}</strong></div>
      <div><span class="detail-label">Prestataire</span><strong>{{ projet.prestataire_nom || '-' }}</strong></div>
      <div><span class="detail-label">Date début prévu</span><strong>{{ formatDate(projet.date_debut_prevu) }}</strong></div>
      <div><span class="detail-label">Créé le</span><strong>{{ formatDate(projet.created_at) }}</strong></div>
      <div><span class="detail-label">Modifié le</span><strong>{{ formatDate(projet.updated_at) }}</strong></div>
    </div>
    <template #footer><Button label="Fermer" severity="secondary" outlined @click="close" /></template>
  </Dialog>
</template>

<style scoped>
:deep(.projet-dialog) { width: min(52rem, calc(100vw - 2rem)); }
.projet-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.projet-details div { display: grid; gap: 0.4rem; }
.detail-label { color: #64748b; font-size: 0.8rem; font-weight: 800; }
.details-wide { grid-column: 1 / -1; }
.projet-details strong { color: #0f172a; font-weight: 700; overflow-wrap: anywhere; }
@media (max-width: 760px) { .projet-details { grid-template-columns: 1fr; } }
</style>
