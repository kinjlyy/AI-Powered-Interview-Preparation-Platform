import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#process' },
  { label: 'Question Bank', href: '#question-bank' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

const NavLinks = ({ onClick = () => {} }) => (
  <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600 md:flex-row md:items-center md:gap-8">
    {navLinks.map((link) => (
      <a
        key={link.href}
        href={link.href}
        onClick={() => onClick(false)}
        className="transition hover:text-brand-600"
      >
        {link.label}
      </a>
    ))}
  </nav>
)

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/70 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded-full bg-brand-600/10 px-3 py-1 text-brand-600">
            InterviewPrep
          </span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-10">
          <NavLinks />
          <Link
            to="/login"
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
          >
            Get Started
          </Link>
        </div>

        <button
          className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-brand-200 hover:text-brand-600 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
          <NavLinks onClick={setOpen} />
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar


