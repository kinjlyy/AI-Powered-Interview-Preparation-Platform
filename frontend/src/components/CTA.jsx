import { Link } from 'react-router-dom'

const CTA = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-5xl rounded-[40px] bg-cta-gradient px-8 py-16 text-center text-white shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
        Ready to ace your interviews?
      </p>
      <h3 className="mt-4 text-3xl font-semibold">
        This is the fastest way to ship your next offer
      </h3>
      <p className="mt-4 text-sm text-slate-200">
        Try it free for 7 days, then choose a plan that matches your prep
        sprint.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          to="/login"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
        >
          Get Started
        </Link>
        <a
          href="#features"
          className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Explore Platform
        </a>
      </div>
    </div>
  </section>
)

export default CTA



