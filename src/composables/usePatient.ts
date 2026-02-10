/**
 * Patient Management Composable
 * Design Pattern: Composable Pattern
 * Handles patient search and data management
 */

import { ref } from 'vue'

// Mock patients database
const MOCK_PATIENTS = [
  {
    cpf: '11122233344',
    name: 'João Silva Santos',
    birthDate: '1990-05-15'
  },
  {
    cpf: '22233344455',
    name: 'Maria Oliveira Costa',
    birthDate: '1985-08-20'
  },
  {
    cpf: '33344455566',
    name: 'Pedro Henrique Souza',
    birthDate: '1995-03-10'
  },
  {
    cpf: '44455566677',
    name: 'Ana Paula Lima',
    birthDate: '1988-11-25'
  }
]

export interface Patient {
  cpf: string
  name: string
  birthDate: string
}

export const usePatient = () => {
  const isSearching = ref(false)

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
   * Searches for a patient by CPF
   */
  const searchPatient = async (cpf: string): Promise<{ success: boolean; patient?: Patient; error?: string }> => {
    isSearching.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const cleanCpf = cpf.replace(/\D/g, '')
      const patient = MOCK_PATIENTS.find(p => p.cpf === cleanCpf)

      if (patient) {
        return {
          success: true,
          patient
        }
      }

      return {
        success: false,
        error: 'CPF not found'
      }
    } finally {
      isSearching.value = false
    }
  }

  /**
   * Validates CPF format
   */
  const validateCpf = (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '')
    return cleanCpf.length === 11
  }

  return {
    isSearching,
    formatCpf,
    searchPatient,
    validateCpf
  }
}
