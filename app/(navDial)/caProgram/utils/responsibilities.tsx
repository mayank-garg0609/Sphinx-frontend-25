import type { ResponsibilityItem } from '../types/caProgram'

export const responsibilities: readonly ResponsibilityItem[] = [
  {
    id: 'promote-events',
    description: 'Promote Sphinx events and workshops across your campus'
  },
  {
    id: 'official-representative',
    description: 'Serve as the official Sphinx representative at your institution'
  },
  {
    id: 'coordinate-administration',
    description: 'Coordinate with college administration and student clubs'
  },
  {
    id: 'build-networks',
    description: 'Build and share relevant student networks for maximum reach'
  },
] as const