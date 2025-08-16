import { memo } from 'react'
import AmbassadorCard from './AmbassadorCard'
import { ambassadors } from '../utils/ambassadors'

const AmbassadorsSection = memo(function AmbassadorsSection() {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-yellow-300 drop-shadow-lg text-center">
        Meet Our Top Ambassadors
      </h2>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {ambassadors.map((applicant, index) => (
          <AmbassadorCard 
            key={applicant.id} 
            applicant={applicant}
            priority={index < 2} // Only prioritize first 2 images
          />
        ))}
      </div>
    </section>
  )
})

export default AmbassadorsSection