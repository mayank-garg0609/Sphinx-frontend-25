import { memo } from 'react'
import Icon from './icon'
import { perks } from '../utils/perks'

const PerksSection = memo(function PerksSection() {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
        What You'll Get
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {perks.map((perk) => (
          <div 
            key={perk.id}
            className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200"
          >
            <Icon 
              name={perk.icon} 
              className="text-yellow-300 mt-1 flex-shrink-0" 
              size={18} 
            />
            <span className="text-sm lg:text-base text-gray-100">
              {perk.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
})

export default PerksSection