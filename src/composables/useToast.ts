/**
 * Toast Notification Composable
 * Design Pattern: Composable Pattern + Observer Pattern
 * Centralized notification system
 */

import { ref } from 'vue'

export interface Toast {
  message: string
  color: string
  visible: boolean
}

export const useToast = () => {
  const toast = ref<Toast>({
    message: '',
    color: 'success',
    visible: false
  })

  const showToast = (message: string, color: string = 'success') => {
    toast.value = {
      message,
      color,
      visible: true
    }

    // Auto-hide after 3 seconds
    setTimeout(() => {
      toast.value.visible = false
    }, 3000)
  }

  const showError = (message: string) => {
    showToast(message, 'error')
  }

  const showSuccess = (message: string) => {
    showToast(message, 'success')
  }

  const hideToast = () => {
    toast.value.visible = false
  }

  return {
    toast,
    showToast,
    showError,
    showSuccess,
    hideToast
  }
}
