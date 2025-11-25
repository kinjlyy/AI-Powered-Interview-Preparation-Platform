import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '../data/faqs'

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
    <button
      className="flex w-full items-center justify-between text-left"
      onClick={onToggle}
    >
      <span className="text-base font-semibold text-slate-900">
        {item.question}
      </span>
      <ChevronDown
        className={`text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
    )}
  </div>
)

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Frequently Asked Questions
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Get clarity on how InterviewPrep supports your goals
          </h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((item, index) => (
            <AccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ



