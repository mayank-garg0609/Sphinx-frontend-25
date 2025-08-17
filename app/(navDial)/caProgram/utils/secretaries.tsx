import { ContactPerson } from "../types/caProgram"

export const contactPersons: readonly ContactPerson[] = [
  {
    id: 'secretary-1',
    name: 'Rounak Kumar ',
    designation: 'Publicity Secretary',
    phone: '+91 87092 84599'
  },
  {
    id: 'secretary-2', 
    name: 'Kasak Nabhiwani',
    designation: 'Publicity Secretary',
    phone: '+91 70732 36849'
  },
  {
    id: 'secretary-3',
    name: 'Harshita Ganesh', 
    designation: 'Publicity Secretary',
    phone: '+91 72099 98103'
  }
] as const

export const commonEmail = 'outreach.sphinx@mnit.ac.in'