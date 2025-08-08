import { memo } from 'react'
import type { IconProps } from '../tupes/caProgram'
import { iconPaths } from '../utils/icons'

const Icon = memo<IconProps>(function Icon({ 
  name, 
  className = "text-purple-300", 
  size = 18 
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`${name} icon`}
    >
      <path d={iconPaths[name]} />
    </svg>
  )
})

export default Icon