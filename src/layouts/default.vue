<!--
  Default Layout with Sidebar
  Design Pattern: Layout Pattern
  Provides consistent navigation structure across pages
-->

<template>
  <v-app>
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="#0a2936"
      theme="dark"
      class="sidebar"
    >
      <template #prepend>
        <div class="pa-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <div v-if="!rail" class="d-flex align-center w-100">
              <v-img
                src="@/assets/logo.png"
                max-width="140"
                height="auto"
                class="mx-auto"
                alt="Logo"
              />
            </div>
            <v-btn
              :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
              variant="text"
              @click.stop="rail = !rail"
            />
          </div>
        </div>
      </template>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :value="item.title"
          color="white"
          rounded="xl"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      color="white"
      elevation="1"
    >
      <v-app-bar-title class="text-primary font-weight-bold">
        Demo Sistema de chamados
      </v-app-bar-title>

      <v-spacer />

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon="mdi-account-circle"
            variant="text"
            v-bind="props"
          />
        </template>

        <v-list>
          <v-list-item @click="handleLogout">
            <v-list-item-title>
              <v-icon icon="mdi-logout" size="small" class="mr-2" />
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main style="background-color: white;">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppointmentForm from '@/components/AppointmentForm.vue'

const router = useRouter()
const drawer = ref(true)
const rail = ref(false)

const menuItems = ref([
  {
    title: 'Criar Novo Chamado',
    icon: 'mdi-calendar-plus',
    to: '/appointments/new'
  },
  {
    title: 'Visualizar Chamados',
    icon: 'mdi-calendar-search',
    to: '/appointments'
  }
])

const handleLogout = () => {
  // TODO: Implement logout logic
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

:deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
