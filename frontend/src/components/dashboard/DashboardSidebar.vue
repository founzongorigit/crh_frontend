<script setup lang="ts">
import type { DashboardModule } from '@/components/dashboard/config/dashboardModules'

defineProps<{
  modules: DashboardModule[]
  activeModule: string
  collapsed: boolean
}>()

const emit = defineEmits<{
  select: [moduleLabel: string]
}>()
</script>

<template>
  <aside class="layout-sidebar" aria-label="Modules">
    <span class="sidebar-label">Modules</span>
    <nav class="sidebar-nav">
      <button
        v-for="module in modules"
        :key="module.label"
        type="button"
        class="sidebar-link"
        :class="{ 'is-active': activeModule === module.label }"
        :title="collapsed ? module.label : undefined"
        @click="emit('select', module.label)"
      >
        <i :class="module.icon" />
        <span>{{ module.label }}</span>
      </button>
    </nav>
  </aside>
</template>
