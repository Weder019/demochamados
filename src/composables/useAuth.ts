/**
 * Authentication Composable
 * Design Pattern: Composable Pattern (Vue 3 Composition API)
 * Handles authentication logic and validation
 */

import { ref } from 'vue'

// Mock credentials
const MOCK_CREDENTIALS = {
  email: 'nextpoint@teste.com',
  cpf: '11122233344',
  password: 'Nextpoint123'
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const useAuth = () => {
  const isLoading = ref(false)

  /**
   * Validates if the input is a CPF (11 digits)
   */
  const isCpf = (value: string): boolean => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue.length === 11 && /^\d+$/.test(cleanValue)
  }

  /**
   * Validates if the input is an email
   */
  const isEmail = (value: string): boolean => {
    return value.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  /**
   * Formats CPF with mask: nnn.nnn.nnn-nn
   */
  const formatCpf = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '')

    if (cleanValue.length <= 3) return cleanValue
    if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`
    if (cleanValue.length <= 9) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`

    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`
  }

  /**
   * Validates username field (email or CPF)
   */
  const validateUsername = (username: string): ValidationResult => {
    if (!username) {
      return { isValid: false, error: 'O usuário não pode ser vazio' }
    }

    const cleanUsername = username.replace(/\D/g, '')

    // If it contains @, must be a valid email
    if (username.includes('@')) {
      if (!isEmail(username)) {
        return { isValid: false, error: 'Formato de e-mail inválido' }
      }
    } else {
      // Otherwise, must be a valid CPF (11 digits)
      if (cleanUsername.length !== 11) {
        return { isValid: false, error: 'O CPF deve ter 11 dígitos' }
      }
    }

    return { isValid: true }
  }

  /**
   * Validates password field
   */
  const validatePassword = (password: string): ValidationResult => {
    if (!password || password.trim() === '') {
      return { isValid: false, error: 'A senha não pode ser vazia' }
    }

    return { isValid: true }
  }

  /**
   * Authenticates user with mock credentials
   */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const { username, password } = credentials
      const cleanUsername = username.replace(/\D/g, '')

      // Check if credentials match mock data
      const isValidEmail = username === MOCK_CREDENTIALS.email
      const isValidCpf = cleanUsername === MOCK_CREDENTIALS.cpf
      const isValidPassword = password === MOCK_CREDENTIALS.password

      if ((isValidEmail || isValidCpf) && isValidPassword) {
        return { success: true }
      }

      return {
        success: false,
        error: 'Usuário ou senha inválidos'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isCpf,
    isEmail,
    formatCpf,
    validateUsername,
    validatePassword,
    login
  }
}
