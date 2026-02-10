/**
 * Doctor Management Composable
 * Design Pattern: Composable Pattern
 * Handles doctor data and selection
 */

import { ref } from 'vue'

// Mock doctors database
const MOCK_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Carlos Eduardo Mendes',
    specialty: 'Cardiologia'
  },
  {
    id: 2,
    name: 'Dra. Juliana Ferreira Rocha',
    specialty: 'Dermatologia'
  },
  {
    id: 3,
    name: 'Dr. Roberto Santos Lima',
    specialty: 'Ortopedia'
  },
  {
    id: 4,
    name: 'Dra. Mariana Costa Silva',
    specialty: 'Pediatria'
  },
  {
    id: 5,
    name: 'Dr. Fernando Alves Souza',
    specialty: 'Neurologia'
  },
  {
    id: 6,
    name: 'Dra. Beatriz Oliveira Gomes',
    specialty: 'Ginecologia'
  },
  {
    id: 7,
    name: 'Dr. Ricardo Pereira Santos',
    specialty: 'Oftalmologia'
  },
  {
    id: 8,
    name: 'Dra. Camila Rodrigues Almeida',
    specialty: 'Psiquiatria'
  }
]

export interface Doctor {
  id: number
  name: string
  specialty: string
}

export const useDoctor = () => {
  const doctors = ref<Doctor[]>(MOCK_DOCTORS)
  const isLoading = ref(false)

  /**
   * Loads all doctors
   */
  const loadDoctors = async (): Promise<Doctor[]> => {
    isLoading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return MOCK_DOCTORS
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Gets a doctor by ID
   */
  const getDoctorById = (id: number): Doctor | undefined => {
    return MOCK_DOCTORS.find(doctor => doctor.id === id)
  }

  /**
   * Formats doctor display name with specialty
   */
  const formatDoctorDisplay = (doctor: Doctor): string => {
    return `${doctor.name} - ${doctor.specialty}`
  }

  return {
    doctors,
    isLoading,
    loadDoctors,
    getDoctorById,
    formatDoctorDisplay
  }
}
