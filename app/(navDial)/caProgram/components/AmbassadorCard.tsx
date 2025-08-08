import { memo } from 'react'
import Image from "next/image"
import type { Applicant } from '../tupes/caProgram'

interface AmbassadorCardProps {
  readonly applicant: Applicant
}

const AmbassadorCard = memo<AmbassadorCardProps>(function AmbassadorCard({ 
  applicant 
}) {
  return (
    <article className="group relative overflow-hidden bg-gradient-to-br from-black/50 via-black/40 to-transparent backdrop-blur-md rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl hover:shadow-yellow-300/20 transition-all duration-300 hover:scale-105 border border-yellow-300/20 hover:border-yellow-300/40">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-2 border-yellow-300/40 group-hover:border-yellow-300 transition-colors duration-300 shadow-lg">
          <Image
            src={applicant.image}
            alt={`${applicant.name} - Campus Ambassador from ${applicant.college}`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
            quality={60}
          />
        </div>
        
        <header className="text-center text-base sm:text-lg font-bold text-white mb-1 drop-shadow-lg">
          {applicant.name}
        </header>
        
        <div className="text-center text-xs sm:text-sm text-yellow-300 mb-2 sm:mb-3 font-medium">
          {applicant.college}
        </div>
        
        <p className="text-xs sm:text-sm text-center text-gray-200 leading-relaxed line-clamp-4">
          {applicant.experience}
        </p>
      </div>
    </article>
  )
})

export default AmbassadorCard