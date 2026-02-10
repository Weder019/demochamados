/**
 * Layouts Plugin
 * Handles layout management for pages
 */

/**
 * Layouts Plugin
 * Handles layout management for pages
 */
import type { App } from 'vue'
import DefaultLayout from '@/layouts/default.vue'

export const layouts = {
  default: DefaultLayout
}

export default function registerLayouts(app: App) {
  // Register layouts globally
  Object.entries(layouts).forEach(([name, component]) => {
    app.component(`${name}-layout`, component)
  })
}
