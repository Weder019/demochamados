<!--
  Login Page Component
  Design Patterns Used:
  - Presentation/Container Pattern: Separates UI from business logic
  - Composition API: Composables for reusable logic (useAuth, useToast)
  - Single Responsibility: Each composable handles one concern
-->

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="elevation-12 rounded-lg">
          <v-card-title class="text-h5 text-center pa-6 bg-primary">
            <span class="text-white font-weight-bold">Demo Chamados</span>
          </v-card-title>

          <v-card-text class="pa-8">
            <v-form ref="formRef" @submit.prevent="handleLogin">
              <!-- Username Field (Email or CPF) -->
              <v-text-field
                v-model="formattedUsername"
                :label="usernameLabel"
                :placeholder="usernamePlaceholder"
                :error="usernameError"
                :error-messages="usernameErrorMessage"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-2"
                @input="onUsernameInput"
                @blur="onUsernameBlur"
              />

              <!-- Password Field -->
              <v-text-field
                v-model="credentials.password"
                :label="passwordLabel"
                :type="showPassword ? 'text' : 'password'"
                :error="passwordError"
                :error-messages="passwordErrorMessage"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-2"
                @click:append-inner="togglePasswordVisibility"
                @blur="onPasswordBlur"
              />

              <!-- Forgot Password Link -->
              <div class="text-right mb-4">
                <a
                  href="#"
                  class="text-decoration-none text-primary"
                  @click.prevent="handleForgotPassword"
                >
                  Forgot your password?
                </a>
              </div>

              <!-- Login Button -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                class="text-none font-weight-bold"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Toast Notification -->
    <v-snackbar
      v-model="toast.visible"
      :color="toast.color"
      location="top"
      :timeout="3000"
    >
      {{ toast.message }}
      <template #actions>
        <v-btn
          variant="text"
          @click="hideToast"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

// Composables
const router = useRouter()
const { isLoading, formatCpf, validateUsername, validatePassword, login } = useAuth()
const { toast, showError, hideToast } = useToast()

// Refs
const formRef = ref()
const showPassword = ref(false)
const credentials = ref({
  username: '',
  password: ''
})

// Error states
const usernameError = ref(false)
const usernameErrorMessage = ref('')
const passwordError = ref(false)
const passwordErrorMessage = ref('')

// Track if user is typing CPF or Email
const isTypingCpf = ref(false)

// Computed Properties
const usernameLabel = computed(() => {
  return isTypingCpf.value ? 'CPF' : 'Email or CPF'
})

const usernamePlaceholder = computed(() => {
  return isTypingCpf.value ? '000.000.000-00' : 'email@example.com or CPF'
})

const passwordLabel = 'Password'

const formattedUsername = computed({
  get: () => {
    if (isTypingCpf.value && credentials.value.username) {
      return formatCpf(credentials.value.username)
    }
    return credentials.value.username
  },
  set: (value: string) => {
    credentials.value.username = value
  }
})

// Watch for username changes to detect CPF input
watch(() => credentials.value.username, (newValue) => {
  const hasOnlyNumbers = /^\d/.test(newValue)
  const cleanValue = newValue.replace(/\D/g, '')
  
  // If user starts typing numbers and no @, assume it's CPF
  if (hasOnlyNumbers && cleanValue.length > 0) {
    isTypingCpf.value = true
  } else if (newValue.includes('@')) {
    isTypingCpf.value = false
  }
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onUsernameInput = () => {
  // Clear error on input
  if (usernameError.value) {
    usernameError.value = false
    usernameErrorMessage.value = ''
  }
}

const onUsernameBlur = () => {
  // Validate on blur
  const validation = validateUsername(credentials.value.username)
  if (!validation.isValid && credentials.value.username) {
    usernameError.value = true
    usernameErrorMessage.value = validation.error || ''
  }
}

const onPasswordBlur = () => {
  // Clear error on input
  if (passwordError.value) {
    passwordError.value = false
    passwordErrorMessage.value = ''
  }
}

const handleForgotPassword = () => {
  // TODO: Implement forgot password functionality
  showError('Forgot password functionality coming soon!')
}

const validateForm = (): boolean => {
  let isValid = true

  // Validate username
  const usernameValidation = validateUsername(credentials.value.username)
  if (!usernameValidation.isValid) {
    usernameError.value = true
    usernameErrorMessage.value = usernameValidation.error || ''
    isValid = false
  }

  // Validate password
  const passwordValidation = validatePassword(credentials.value.password)
  if (!passwordValidation.isValid) {
    passwordError.value = true
    passwordErrorMessage.value = passwordValidation.error || ''
    showError('Password cannot be empty')
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  // Clear previous errors
  usernameError.value = false
  usernameErrorMessage.value = ''
  passwordError.value = false
  passwordErrorMessage.value = ''

  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    // Attempt login
    const result = await login({
      username: credentials.value.username,
      password: credentials.value.password
    })

    if (result.success) {
      // Redirect to home page on success
      router.push('/')
    } else {
      // Show error toast for invalid credentials
      showError('Invalid username or password')
    }
  } catch (error) {
    console.error('Login error:', error)
    showError('An error occurred. Please try again.')
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-primary {
  background-color: #1d39b5 !important;
}

.text-primary {
  color: #1d39b5 !important;
}

:deep(.v-btn--variant-elevated) {
  background-color: #1d39b5 !important;
}
</style>
