import { Github, Linkedin, Twitter } from 'lucide-react'

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-lg font-semibold text-white">InterviewPrep</p>
        <p className="mt-2 text-sm text-slate-400">
          Practice smarter. Interview calmer. Land offers faster.
        </p>
      </div>
      <div className="flex gap-4 text-slate-300">
        {[Github, Linkedin, Twitter].map((Icon) => (
          <a
            key={Icon.name}
            href="#"
            className="rounded-full border border-slate-800 p-2 transition hover:border-brand-500 hover:text-white"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
    <div className="border-t border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-xs text-slate-500 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} InterviewPrep. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">
            About
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer



