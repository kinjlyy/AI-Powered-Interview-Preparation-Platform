import { features } from '../data/features'

const Features = () => (
  <section id="features" className="bg-white py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Why Choose Our Platform?
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">
          Built for ambitious engineers, product folks, and analysts
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon size={22} />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-3 text-sm text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Features



