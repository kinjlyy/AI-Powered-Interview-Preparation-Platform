import { categories } from '../data/categories'
import { BookOpenCheck } from 'lucide-react'

const QuestionBank = () => (
  <section id="question-bank" className="bg-white py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Explore Our Question Bank
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Find the question in more multiple categories to prepare every
            round.
          </h2>
        </div>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
        >
          <BookOpenCheck size={18} />
          Browse library
        </a>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.title}
            className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {category.title}
              </h3>
              <span className="text-xs font-semibold uppercase text-slate-500">
                {category.meta}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default QuestionBank



