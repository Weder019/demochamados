/**
 * Appointment Management Composable
 * Design Pattern: Composable Pattern
 * Handles appointment scheduling and available time slots
 */

import { ref } from 'vue'

// Mock available time slots per doctor per date
const MOCK_AVAILABILITY: Record<string, string[]> = {
  '2026-02-10_1': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  '2026-02-10_2': ['08:30', '09:30', '10:30', '11:30', '14:30', '15:30'],
  '2026-02-10_3': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  '2026-02-11_1': ['08:00', '09:00', '10:00', '14:00', '15:00'],
  '2026-02-11_2': ['08:30', '09:30', '10:30', '14:30', '15:30', '16:30'],
  '2026-02-12_1': ['08:00', '09:00', '11:00', '14:00', '16:00'],
  '2026-02-12_3': ['09:00', '10:00', '11:00', '14:00', '15:00'],
  '2026-02-13_2': [],  // No availability
  '2026-02-14_1': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  '2026-02-14_4': ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00']
}

export interface TimeSlot {
  time: string
  available: boolean
}

export const useAppointment = () => {
  const isLoadingSlots = ref(false)

  /**
   * Gets available time slots for a specific doctor on a specific date
   */
  const getAvailableSlots = async (doctorId: number, date: string): Promise<string[]> => {
    isLoadingSlots.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      const key = `${date}_${doctorId}`
      return MOCK_AVAILABILITY[key] || []
    } finally {
      isLoadingSlots.value = false
    }
  }

  /**
   * Formats date to YYYY-MM-DD
   */
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * Formats date to DD/MM/YYYY
   */
  const formatDateDisplay = (date: string): string => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  /**
   * Validates if date is not in the past
   */
  const isValidDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  /**
   * Books an appointment
   */
  const bookAppointment = async (
    patientCpf: string,
    doctorId: number,
    date: string,
    time: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (!patientCpf || !doctorId || !date || !time) {
        return {
          success: false,
          error: 'Missing required fields'
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to book appointment'
      }
    }
  }

  return {
    isLoadingSlots,
    getAvailableSlots,
    formatDate,
    formatDateDisplay,
    isValidDate,
    bookAppointment
  }
}
