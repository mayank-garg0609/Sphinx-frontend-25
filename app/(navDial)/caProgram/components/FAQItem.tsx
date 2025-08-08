'use client'

import { memo } from 'react'
import type { FAQ } from '../tupes/caProgram'

interface FAQItemProps {
  readonly faq: FAQ
  readonly isOpen: boolean
  readonly onToggle: () => void
}

const FAQItem = memo<FAQItemProps>(function FAQItem({ 
  faq, 
  isOpen, 
  onToggle 
}) {
  return (
    <div className="rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200 border border-yellow-300/20 hover:border-yellow-300/40">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full px-3 sm:px-4 py-3 text-sm sm:text-base font-medium text-white text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 rounded-lg"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span className="drop-shadow-sm pr-2">{faq.question}</span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 transform transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div 
          id={`faq-answer-${faq.id}`}
          className="px-3 sm:px-4 pb-3 pt-1 text-sm sm:text-base text-gray-200 leading-relaxed"
        >
          {faq.answer}
        </div>
      )}
    </div>
  )
})

export default FAQItem