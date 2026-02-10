/**
 * Manual Route Definitions
 * Defines routes with layout metadata
 */

import type { RouteRecordRaw } from 'vue-router'
import appointments from '@/pages/appointments/index.vue'
import appointmentsNew from '@/pages/appointments/new.vue'
 export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: { layout: 'simple' }
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: appointments,
    meta: { layout: 'default' }
  },
  {
    path: '/appointments/new',
    name: 'appointments-new',
    component: appointmentsNew,
    meta: { layout: 'default' }
  }
]
