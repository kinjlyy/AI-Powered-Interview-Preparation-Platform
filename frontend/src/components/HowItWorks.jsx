import { CalendarClock, CheckCircle2, PlayCircle, Zap } from 'lucide-react'

const steps = [
  {
    title: 'Personalize your roadmap',
    description: 'Pick role, target company, and schedule auto reminders.',
    icon: CalendarClock,
  },
  {
    title: 'Attempt smart sessions',
    description: 'AI coaches adapt difficulty and follow-up probing in real time.',
    icon: PlayCircle,
  },
  {
    title: 'Get instant feedback & insights',
    description: 'Receive annotated transcripts, scoring rubrics, and trends.',
    icon: Zap,
  },
  {
    title: 'Ship your next interview',
    description: 'Track improvements, share reports, and walk in confident.',
    icon: CheckCircle2,
  },
]

const HowItWorks = () => (
  <section id="process" className="bg-slate-50 py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          How It Works
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">
          Simple steps with compounding confidence
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ title, description, icon: Icon }, idx) => (
          <div
            key={title}
            className="rounded-3xl border border-transparent bg-white/70 p-6 shadow-card ring-1 ring-slate-100 transition hover:-translate-y-1 hover:ring-brand-100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon size={22} />
            </div>
            <p className="mt-6 text-sm font-semibold text-brand-500">
              Step {idx + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-3 text-sm text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HowItWorks



