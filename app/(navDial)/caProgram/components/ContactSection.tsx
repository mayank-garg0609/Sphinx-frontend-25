import { memo } from 'react'
import type { IconProps } from '../types/caProgram'
import { iconPaths } from '../utils/icons'
import {contactPersons,commonEmail} from "../utils/secretaries"

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

const ContactSection = memo(function ContactSection() {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-yellow-300 drop-shadow-lg text-center">
        Contact Us for More Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {contactPersons.map((person) => (
          <div 
            key={person.id}
            className="bg-black/40 backdrop-blur-md rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:bg-black/50 transition-all duration-300 hover:scale-105 border border-yellow-300/20 hover:border-yellow-300/40"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-300/20 to-yellow-500/20 rounded-full flex items-center justify-center">
                <Icon 
                  name="userCheck" 
                  className="text-yellow-300" 
                  size={24} 
                />
              </div>
              <h3 className="text-white font-bold text-base lg:text-lg mb-1">
                {person.name}
              </h3>
              <p className="text-yellow-300 text-sm font-medium mb-3">
                {person.designation}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg
                  className="text-gray-300 flex-shrink-0"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  role="img"
                  aria-label="phone icon"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a 
                  href={`tel:${person.phone}`}
                  className="text-gray-200 text-sm hover:text-yellow-300 transition-colors duration-200"
                >
                  {person.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-yellow-300/10">
        <div className="mb-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon 
              name="badge" 
              className="text-yellow-300" 
              size={18} 
            />
            <span className="text-yellow-300 font-semibold text-base">
              General Inquiries
            </span>
          </div>
          <a 
            href={`mailto:${commonEmail}`}
            className="text-gray-200 hover:text-yellow-300 transition-colors duration-200 text-base font-medium"
          >
            {commonEmail}
          </a>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Have questions about the Campus Ambassador program? Feel free to reach out to any of our publicity secretaries 
          or send us an email for general inquiries. They're here to help you with the application process, program details, 
          and any other questions you might have.
        </p>
      </div>
    </section>
  )
})

export default ContactSection