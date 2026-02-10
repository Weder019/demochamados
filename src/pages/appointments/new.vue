<!--
  Create New Appointment Page
  Design Patterns:
  - Presentation/Container Pattern
  - Composition API with Composables
  - Progressive Disclosure (fields enabled as data is filled)
-->

<template>
  <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-6">Create New Appointment</h1>
        </v-col>
      </v-row>

      <!-- Patient Card -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="bg-grey-lighten-4">
              <v-icon icon="mdi-account" class="mr-2" />
              Patient
            </v-card-title>

            <v-card-text class="pa-6">
              <!-- CPF Field with Search -->
              <v-text-field
                v-model="formattedCpf"
                label="CPF"
                variant="outlined"
                placeholder="000.000.000-00"
                :loading="isSearching"
                :disabled="isSearching"
                density="comfortable"
                class="mb-4"
                @input="onCpfInput"
              >
                <template #append-inner>
                  <v-btn
                    icon="mdi-magnify"
                    variant="text"
                    color="primary"
                    :disabled="!isCpfValid || isSearching"
                    :loading="isSearching"
                    @click="handleSearchPatient"
                  />
                </template>
              </v-text-field>

              <!-- Name Field -->
              <v-text-field
                v-model="patientData.name"
                label="Name"
                variant="outlined"
                :disabled="!patientFound"
                density="comfortable"
                readonly
                class="mb-4"
              />

              <!-- Birth Date Field -->
              <v-text-field
                v-model="formattedBirthDate"
                label="Birth Date"
                variant="outlined"
                :disabled="!patientFound"
                density="comfortable"
                readonly
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Doctor Card -->
        <v-col cols="12" md="6">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="bg-grey-lighten-4">
              <v-icon icon="mdi-doctor" class="mr-2" />
              Doctor
            </v-card-title>

            <v-card-text class="pa-6">
              <v-select
                v-model="selectedDoctorId"
                :items="doctorItems"
                item-title="display"
                item-value="id"
                label="Doctor Name and Specialty"
                variant="outlined"
                density="comfortable"
                clearable
                :menu-props="{ maxHeight: 300 }"
                @update:model-value="onDoctorSelect"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-doctor" size="small" />
                </template>
              </v-select>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Time Slots Card -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" :disabled="!selectedDoctorId">
            <v-card-title class="bg-grey-lighten-4">
              <v-icon icon="mdi-clock-outline" class="mr-2" />
              Time Slots
            </v-card-title>

            <v-card-text class="pa-6">
              <!-- Date Picker -->
              <v-text-field
                v-model="formattedDate"
                label="Date"
                variant="outlined"
                placeholder="DD/MM/YYYY"
                :disabled="!selectedDoctorId"
                density="comfortable"
                class="mb-6"
                readonly
                @click="showDatePicker = true"
              >
                <template #prepend-inner>
                  <v-icon 
                    icon="mdi-calendar" 
                    @click="showDatePicker = true"
                    style="cursor: pointer;"
                  />
                </template>
              </v-text-field>

              <!-- Date Picker Dialog -->
              <v-dialog v-model="showDatePicker" max-width="400">
                <v-card>
                  <v-card-text class="pa-0">
                    <v-date-picker
                      v-model="selectedDate"
                      :min="minDate"
                      color="primary"
                      @update:model-value="onDateSelect"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text="Cancel"
                      @click="showDatePicker = false"
                    />
                    <v-btn
                      text="OK"
                      color="primary"
                      @click="confirmDateSelection"
                    />
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Loading Slots -->
              <div v-if="isLoadingSlots" class="text-center py-8">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="50"
                />
                <p class="mt-4 text-body-1">Loading available time slots...</p>
              </div>

              <!-- No Date Selected -->
              <div v-else-if="!selectedDateFormatted && selectedDoctorId" class="text-center py-8">
                <v-icon icon="mdi-calendar-blank" size="64" color="grey" />
                <p class="mt-4 text-body-1 text-grey">Please select a date to view available time slots</p>
              </div>

              <!-- Available Time Slots -->
              <div v-else-if="availableSlots.length > 0">
                <p class="text-subtitle-1 font-weight-bold mb-4">Available Times:</p>
                <v-row>
                  <v-col
                    v-for="slot in availableSlots"
                    :key="slot"
                    cols="6"
                    sm="4"
                    md="3"
                    lg="2"
                  >
                    <v-btn
                      :variant="selectedTimeSlot === slot ? 'elevated' : 'outlined'"
                      :color="selectedTimeSlot === slot ? 'primary' : 'default'"
                      block
                      size="large"
                      @click="selectTimeSlot(slot)"
                    >
                      <v-icon icon="mdi-clock-outline" size="small" class="mr-2" />
                      {{ slot }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <!-- No Slots Available -->
              <div v-else-if="selectedDateFormatted" class="text-center py-8">
                <v-icon icon="mdi-calendar-remove" size="64" color="warning" />
                <p class="mt-4 text-body-1 text-warning">No available time slots for this date</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <v-row class="mt-4">
        <v-col cols="12" class="d-flex justify-end gap-3">
          <v-btn
            variant="outlined"
            size="large"
            @click="handleCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            size="large"
            :disabled="!canBook"
            :loading="isBooking"
            @click="handleBookAppointment"
          >
            <v-icon icon="mdi-check" class="mr-2" />
            Book Appointment
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Toast Notification -->
    <v-snackbar
      v-model="toast.visible"
      :color="toast.color"
      location="top right"
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatient } from '@/composables/usePatient'
import { useDoctor } from '@/composables/useDoctor'
import { useAppointment } from '@/composables/useAppointment'
import { useToast } from '@/composables/useToast'

// Router
const router = useRouter()

// Composables
const { isSearching, formatCpf, searchPatient, validateCpf } = usePatient()
const { doctors, loadDoctors, formatDoctorDisplay } = useDoctor()
const { isLoadingSlots, getAvailableSlots, formatDate, formatDateDisplay } = useAppointment()
const { toast, showError, showSuccess, hideToast } = useToast()

// Patient Data
const patientData = ref({
  cpf: '',
  name: '',
  birthDate: ''
})
const patientFound = ref(false)

// Doctor Data
const selectedDoctorId = ref<number | null>(null)

// Date and Time Data
const selectedDate = ref<Date | null>(null)
const selectedDateFormatted = ref('')
const formattedDate = ref('')
const showDatePicker = ref(false)
const availableSlots = ref<string[]>([])
const selectedTimeSlot = ref('')
const isBooking = ref(false)

// Computed
const formattedCpf = computed({
  get: () => formatCpf(patientData.value.cpf),
  set: (value: string) => {
    patientData.value.cpf = value
  }
})

const isCpfValid = computed(() => validateCpf(patientData.value.cpf))

const formattedBirthDate = computed(() => {
  if (!patientData.value.birthDate) return ''
  return formatDateDisplay(patientData.value.birthDate)
})

const doctorItems = computed(() => {
  return doctors.value.map(doctor => ({
    id: doctor.id,
    display: formatDoctorDisplay(doctor)
  }))
})

const minDate = computed(() => {
  const today = new Date()
  return today
})

const canBook = computed(() => {
  return patientFound.value && 
         selectedDoctorId.value !== null && 
         selectedDateFormatted.value !== '' && 
         selectedTimeSlot.value !== ''
})

// Methods
const onCpfInput = () => {
  // Clear patient data when CPF changes
  if (patientFound.value) {
    patientData.value.name = ''
    patientData.value.birthDate = ''
    patientFound.value = false
  }
}

const handleSearchPatient = async () => {
  if (!isCpfValid.value) {
    showError('Invalid CPF format')
    return
  }

  const result = await searchPatient(patientData.value.cpf)

  if (result.success && result.patient) {
    patientData.value.name = result.patient.name
    patientData.value.birthDate = result.patient.birthDate
    patientFound.value = true
    showSuccess('Patient found successfully')
  } else {
    showError('CPF not found')
    patientData.value.name = ''
    patientData.value.birthDate = ''
    patientFound.value = false
  }
}

const onDoctorSelect = () => {
  // Clear time slots when doctor changes
  selectedDate.value = null
  selectedDateFormatted.value = ''
  formattedDate.value = ''
  availableSlots.value = []
  selectedTimeSlot.value = ''
}

const onDateSelect = (date: Date) => {
  selectedDate.value = date
}

const confirmDateSelection = async () => {
  if (!selectedDate.value) return

  showDatePicker.value = false
  selectedDateFormatted.value = formatDate(selectedDate.value)
  formattedDate.value = formatDateDisplay(selectedDateFormatted.value)
  
  // Load available slots
  if (selectedDoctorId.value) {
    availableSlots.value = await getAvailableSlots(selectedDoctorId.value, selectedDateFormatted.value)
    selectedTimeSlot.value = ''
  }
}

const selectTimeSlot = (slot: string) => {
  selectedTimeSlot.value = slot
}

const handleBookAppointment = async () => {
  if (!canBook.value) return

  isBooking.value = true

  try {
    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showSuccess('Appointment booked successfully!')
    
    // Reset form after 2 seconds
    setTimeout(() => {
      router.push('/appointments')
    }, 2000)
  } catch (error) {
    showError('Failed to book appointment')
  } finally {
    isBooking.value = false
  }
}

const handleCancel = () => {
  router.push('/appointments')
}

// Lifecycle
onMounted(async () => {
  await loadDoctors()
})

// Define layout
defineOptions({
  layout: 'default'
})
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

:deep(.v-btn) {
  text-transform: none;
}

:deep(.v-date-picker) {
  width: 100%;
}
</style>
