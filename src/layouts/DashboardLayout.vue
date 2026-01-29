<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import router from '@/router'
import { useRoute } from 'vue-router'

const { logout } = useAuth()
const route = useRoute()
</script>

<template>
  <v-app>
    <v-app-bar elevation="2">
      <v-app-bar-title>Task Done App</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" @click="logout">
        <v-icon start>mdi-logout</v-icon>
        Salir
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer permanent>
      <v-list nav>
        <v-list-item
          title="Perfil"
          prepend-icon="mdi-account"
          :active="route.name === 'profile'"
          @click="router.push({ name: 'profile' })"
        />
        <v-list-item
          title="Tareas"
          prepend-icon="mdi-format-list-checks"
          :active="route.name === 'tasks'"
          @click="router.push({ name: 'tasks' })"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-5" style="min-height: 95vh">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer border class="justify-center">
      <span class="text-caption">© 2025 - Proyecto Vue 3</span>
    </v-footer>
  </v-app>
</template>
