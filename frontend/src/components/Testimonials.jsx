import { Star } from 'lucide-react'
import { testimonials } from '../data/testimonials'

const Testimonials = () => (
  <section id="testimonials" className="bg-slate-50 py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          What Our Users Say
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Thousands of offers landed with actionable insights
        </h2>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map(({ name, role, quote, rating, avatar }) => (
          <div
            key={name}
            className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <div className="flex items-center gap-2 text-brand-500">
              {Array.from({ length: rating }).map((_, idx) => (
                <Star key={idx} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm text-slate-600">{quote}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/10 text-sm font-semibold text-brand-700">
                {avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials



