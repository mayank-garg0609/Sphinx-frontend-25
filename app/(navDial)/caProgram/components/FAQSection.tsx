'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import FAQItem from './FAQItem'
import { faqs } from '../utils/faqs'

const FAQSection = memo(function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  const faqItems = useMemo(
    () =>
      faqs.map((faq, index) => (
        <FAQItem
          key={faq.id}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => toggleFAQ(index)}
        />
      )),
    [openIndex, toggleFAQ]
  )

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-yellow-300 drop-shadow-lg text-center">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-2 sm:space-y-3 max-w-4xl mx-auto">
        {faqItems}
      </div>
    </section>
  )
})

export default FAQSection