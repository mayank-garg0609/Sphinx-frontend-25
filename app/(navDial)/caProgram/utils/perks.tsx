import type { PerkItem } from '../types/caProgram'

export const perks: readonly PerkItem[] = [
  {
    id: 'courses-workshops',
    icon: 'book',
    title: 'Free courses & workshops access'
  },
  {
    id: 'internship-certificate', 
    icon: 'badge',
    title: 'Official internship certificate'
  },
  {
    id: 'sponsor-opportunities',
    icon: 'users', 
    title: 'Sponsor internship opportunities'
  },
  {
    id: 'networking',
    icon: 'share',
    title: 'Professional networking & endorsements'
  },
  {
    id: 'recognition',
    icon: 'star',
    title: 'Monthly recognition & shoutouts'
  },
  {
    id: 'recommendation',
    icon: 'userCheck',
    title: 'Letter of recommendation'
  },
] as const