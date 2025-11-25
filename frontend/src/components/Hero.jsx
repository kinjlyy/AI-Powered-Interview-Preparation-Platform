import { Link } from 'react-router-dom'
import { CheckCircle, Sparkles } from 'lucide-react'

const Hero = () => (
  <section
    id="top"
    className="relative overflow-hidden bg-hero-gradient pt-28 pb-20"
  >
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-200 blur-3xl opacity-40" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-brand-100 blur-3xl opacity-40" />
    </div>
    <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-600 shadow-card">
        <Sparkles size={16} />
        Interview-ready in weeks, not months
      </span>

      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
          Ace Your Interviews
        </h1>
        <p className="text-lg text-slate-600 md:text-xl">
          Practice with AI-driven mocks, smart feedback, and curated question
          banks so you walk into every interview confident.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          to="/login"
          className="rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
        >
          Get Started
        </Link>
        <a
          href="#features"
          className="rounded-full border border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-600"
        >
          See What&apos;s Inside
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <CheckCircle size={16} className="text-brand-500" />
          Trusted by 12k+ candidates
        </span>
        <span className="inline-flex items-center gap-2">
          <CheckCircle size={16} className="text-brand-500" />
          Average rating 4.9/5
        </span>
      </div>
    </div>
  </section>
)

export default Hero


