<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { User } from '@/types/user'

defineProps<{
  user: User | null
  sidebarCollapsed: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
  viewProfile: []
  logout: []
}>()

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const viewProfile = () => {
  userMenuOpen.value = false
  emit('viewProfile')
}

const closeUserMenuOnOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node | null

  if (target && userMenuRef.value?.contains(target)) return

  userMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeUserMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeUserMenuOnOutsideClick)
})
</script>

<template>
  <header class="layout-topbar">
    <div class="layout-brand">
      <Button
        :icon="sidebarCollapsed ? 'pi pi-bars' : 'pi pi-angle-left'"
        severity="secondary"
        text
        rounded
        aria-label="Plier le menu"
        :aria-expanded="!sidebarCollapsed"
        @click="emit('toggleSidebar')"
      />
      <span class="layout-brand-mark">
        <i class="pi pi-shield" />
      </span>
      <span>SGSPH</span>
    </div>

    <div class="topbar-actions">
      <Button
        icon="pi pi-bell"
        severity="secondary"
        text
        rounded
        aria-label="Notifications"
        class="notification-button"
      />

      <div ref="userMenuRef" class="user-menu">
        <button
          class="user-tab"
          type="button"
          aria-label="Menu utilisateur"
          :aria-expanded="userMenuOpen"
          @click="toggleUserMenu"
        >
          <span class="user-avatar">
            {{ user?.prenom?.charAt(0) || 'U' }}{{ user?.nom?.charAt(0) || '' }}
          </span>
          <span class="user-meta">
            <span class="user-name">{{ user?.prenom }} {{ user?.nom }}</span>
            <span class="user-role">{{ user?.profil }}</span>
          </span>
          <i class="pi pi-angle-down" />
        </button>

        <div v-if="userMenuOpen" class="user-dropdown" role="menu">
          <button type="button" class="user-dropdown-item" role="menuitem" @click="viewProfile">
            <i class="pi pi-user" />
            <span>Profil</span>
          </button>
          <button type="button" class="user-dropdown-item" role="menuitem">
            <i class="pi pi-cog" />
            <span>Paramètres</span>
          </button>
          <button type="button" class="user-dropdown-item" role="menuitem">
            <i class="pi pi-question-circle" />
            <span>Aide</span>
          </button>
          <button type="button" class="user-dropdown-item danger" role="menuitem" @click="emit('logout')">
            <i class="pi pi-sign-out" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
