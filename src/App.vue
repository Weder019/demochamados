<template>
  <component :is="layoutComponent" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import SimpleLayout from '@/layouts/simple.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return route.meta.layout === 'simple' ? SimpleLayout : DefaultLayout
})
</script>
